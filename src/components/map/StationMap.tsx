"use client";

import { useState, useCallback } from "react";
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  AttributionControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useTheme } from "next-themes";
import type { Station } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";
import {
  Thermometer,
  Droplets,
  Gauge,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";
import { StationAccessDialog } from "@/components/dialogs/StationAccessDialog";

const LIGHT_STYLE = "https://tiles.versatiles.org/assets/styles/colorful/style.json";
const DARK_STYLE = "https://tiles.versatiles.org/assets/styles/eclipse/style.json";

// Initial viewport centered on Java, Indonesia (or specific station)
const INITIAL_VIEW = {
  longitude: parseFloat(process.env.NEXT_PUBLIC_STATION_LON || "106.7308"),
  latitude: parseFloat(process.env.NEXT_PUBLIC_STATION_LAT || "-6.5577"),
  zoom: 6.5,
};

export default function StationMap() {
  const { resolvedTheme } = useTheme();
  const { station } = useWeather();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);

  const stations = station ? [station] : [];

  const handleMarkerClick = useCallback(
    (station: Station) => {
      setSelectedStation(station);
    },
    []
  );

  const mapStyle = resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE;

  return (
    <MapGL
      initialViewState={INITIAL_VIEW}
      style={{ width: "100%", height: "100%" }}
      mapStyle={mapStyle}
      attributionControl={false}
    >
      <NavigationControl position="top-left" showCompass={false} />
      <AttributionControl
        compact
        position="bottom-right"
        customAttribution="OpenFreeMap"
      />

      {stations.map((station) => (
        <Marker
          key={station.id}
          longitude={station.coordinates[1]}
          latitude={station.coordinates[0]}
          anchor="center"
          onClick={() => handleMarkerClick(station)}
          style={{ cursor: "pointer" }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulse ring for online stations */}
            {station.status === "online" && (
              <div
                className="absolute h-9 w-9 rounded-full animate-ping"
                style={{
                  backgroundColor:
                    station.status === "online"
                      ? "rgba(16,185,129,0.25)"
                      : "rgba(239,68,68,0.15)",
                  animationDuration: "2s",
                }}
              />
            )}
            {/* Station dot */}
            <div
              className="relative z-10 h-3.5 w-3.5 rounded-full border-2 border-white"
              style={{
                backgroundColor:
                  station.status === "online" ? "#10b981" : "#ef4444",
                boxShadow:
                  station.status === "online"
                    ? "0 0 8px rgba(16,185,129,0.6), 0 2px 6px rgba(0,0,0,0.3)"
                    : "0 0 8px rgba(239,68,68,0.4), 0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </Marker>
      ))}

      {selectedStation && (
        <Popup
          longitude={selectedStation.coordinates[1]}
          latitude={selectedStation.coordinates[0]}
          anchor="bottom"
          onClose={() => setSelectedStation(null)}
          closeOnClick={false}
          className="station-popup-container"
          maxWidth="280px"
          offset={16}
        >
          <div className="min-w-[240px] p-3">
            {/* Station Header */}
            <div className="mb-2.5 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">
                  {selectedStation.id}
                </h3>
                <p className="mt-0.5 text-xs opacity-60">
                  {selectedStation.location}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${selectedStation.status === "online"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400"
                  }`}
              >
                {selectedStation.status === "online" ? (
                  <Wifi className="h-2.5 w-2.5" />
                ) : (
                  <WifiOff className="h-2.5 w-2.5" />
                )}
                {selectedStation.status === "online" ? "Aktif" : "Offline"}
              </span>
            </div>

            {/* Divider */}
            <div className="mb-2.5 h-px bg-current opacity-10" />

            {/* Current Readings */}
            <div className="mb-2.5 grid grid-cols-3 gap-1.5">
              <div className="rounded-md bg-black/5 dark:bg-white/5 p-1.5 overflow-hidden">
                <div className="mb-0.5 flex items-center gap-1 text-[10px] opacity-50 truncate">
                  <Thermometer className="h-2.5 w-2.5 shrink-0" />
                  Suhu
                </div>
                <p className="text-xs font-semibold tracking-tighter truncate">
                  {selectedStation.latestData?.temperature ?? "--"}
                  <span className="text-[10px] font-normal opacity-50 ml-0.5">C</span>
                </p>
              </div>
              <div className="rounded-md bg-black/5 dark:bg-white/5 p-1.5 overflow-hidden">
                <div className="mb-0.5 flex items-center gap-1 text-[10px] opacity-50 truncate">
                  <Droplets className="h-2.5 w-2.5 shrink-0" />
                  Lembab
                </div>
                <p className="text-xs font-semibold tracking-tighter truncate">
                  {selectedStation.latestData?.humidity ?? "--"}
                  <span className="text-[10px] font-normal opacity-50 ml-0.5">%</span>
                </p>
              </div>
              <div className="rounded-md bg-black/5 dark:bg-white/5 p-1.5 overflow-hidden">
                <div className="mb-0.5 flex items-center gap-1 text-[10px] opacity-50 truncate">
                  <Gauge className="h-2.5 w-2.5 shrink-0" />
                  Tekanan
                </div>
                <p className="text-xs font-semibold tracking-tighter truncate">
                  {selectedStation.latestData?.pressure ?? "--"}
                  <span className="text-[10px] font-normal opacity-50 ml-0.5">hPa</span>
                </p>
              </div>
            </div>

            {/* View Dashboard Link */}
            <button
              onClick={() => setIsAccessDialogOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-500/15 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-500/25"
            >
              Lihat Dasbor
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </Popup>
      )}

      <StationAccessDialog
        open={isAccessDialogOpen}
        onOpenChange={setIsAccessDialogOpen}
        stationId={selectedStation?.id || null}
      />
    </MapGL>
  );
}
