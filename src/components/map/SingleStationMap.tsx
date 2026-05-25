"use client";

import MapGL, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import type { Station } from "@/types/weather";
import { useEffect, useState } from "react";

const LIGHT_STYLE = "https://tiles.versatiles.org/assets/styles/colorful/style.json";
const DARK_STYLE = "https://tiles.versatiles.org/assets/styles/eclipse/style.json";

export default function SingleStationMap({ station }: { station: Station }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const mapStyle = resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE;

  // Coordinates are already resolved in the parent (API -> env-var fallback)
  const lat = station.coordinates[0];
  const lon = station.coordinates[1];

  const initialView = {
    longitude: lon,
    latitude: lat,
    zoom: 12,
  };

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border">
      <MapGL
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        <NavigationControl position="top-left" showCompass={false} />
        <Marker
          longitude={lon}
          latitude={lat}
          anchor="center"
        >
          <div className="relative flex items-center justify-center">
            {station.status === "online" && (
              <div
                className="absolute h-9 w-9 rounded-full animate-ping"
                style={{
                  backgroundColor: "rgba(16,185,129,0.25)",
                  animationDuration: "2s",
                }}
              />
            )}
            <div
              className="relative z-10 h-3.5 w-3.5 rounded-full border-2 border-white"
              style={{
                backgroundColor: station.status === "online" ? "#10b981" : "#ef4444",
                boxShadow: station.status === "online"
                  ? "0 0 8px rgba(16,185,129,0.6), 0 2px 6px rgba(0,0,0,0.3)"
                  : "0 0 8px rgba(239,68,68,0.4), 0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </Marker>
      </MapGL>
    </div>
  );
}
