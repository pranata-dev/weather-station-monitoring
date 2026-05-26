"use client";

import { useState, useEffect } from "react";
import type { Station } from "@/types/weather";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useWeather() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    async function fetchStations() {
      try {
        setError(null);
        
        const res = await fetch(`${API_URL}/api/v1/stations/list`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch stations list");
        }

        const data = await res.json();

        if (isMounted) {
          const fetchedStations = data.data || [];
          
          const mappedStations = fetchedStations.map((s: any) => {
            const latest = s.latestData || null;
            const envLat = parseFloat(process.env.NEXT_PUBLIC_STATION_LAT || "-6.5577");
            const envLon = parseFloat(process.env.NEXT_PUBLIC_STATION_LON || "106.7308");

            let stationStatus: "online" | "offline" = "offline";
            if (latest?.timestamp) {
              const latestDate = new Date(latest.timestamp + "Z");
              const now = new Date();
              if (now.getTime() - latestDate.getTime() <= 900000) {
                stationStatus = "online";
              }
            }

            return {
              id: s.station_code,
              name: s.name,
              location: s.location,
              status: stationStatus,
              coordinates: [
                latest?.lat != null ? latest.lat : envLat,
                latest?.lon != null ? latest.lon : envLon,
              ],
              latestData: latest,
              timeSeries: [], // Not fetched globally to save bandwidth
            };
          });

          setStations(mappedStations);
        }
      } catch (err) {
        if (isMounted) {
          setError("Connection Error");
          setStations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStations();

    const intervalId = setInterval(fetchStations, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [trigger]);

  return { stations, isLoading, error, refetch };
}

export async function fetchStationHistory(stationCode: string, limit: number = 2100) {
  try {
    const res = await fetch(`${API_URL}/api/v1/sensor/history?limit=${limit}&station_code=${stationCode}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("fetchStationHistory Error:", err);
    return [];
  }
}
