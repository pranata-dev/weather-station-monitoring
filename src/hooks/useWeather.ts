"use client";

import { useState, useEffect } from "react";
import type { Station } from "@/types/weather";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useWeather() {
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      try {
        setError(null);
        
        const [latestRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/sensor/latest`),
          fetch(`${API_URL}/api/v1/sensor/history?limit=50`)
        ]);

        if (!latestRes.ok || !historyRes.ok) {
          throw new Error("Failed to fetch telemetry data");
        }

        const latestData = await latestRes.json();
        const historyData = await historyRes.json();

        if (isMounted) {
          const latest = latestData.data || null;
          const envLat = parseFloat(process.env.NEXT_PUBLIC_STATION_LAT || "-6.5577");
          const envLon = parseFloat(process.env.NEXT_PUBLIC_STATION_LON || "106.7308");

          setStation({
            id: "ST-01",
            name: "Stasiun Pusat",
            location: "Bogor, Jawa Barat, Indonesia",
            status: "online",
            coordinates: [
              latest?.lat != null ? latest.lat : envLat,
              latest?.lon != null ? latest.lon : envLon,
            ],
            latestData: latest,
            timeSeries: historyData.data || [],
          });
        }
      } catch (err) {
        if (isMounted) {
          setError("Connection Error");
          setStation(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    // Polling every 60 seconds
    const intervalId = setInterval(fetchWeather, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { station, isLoading, error };
}
