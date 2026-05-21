"use client";

import Navbar from "@/components/layout/Navbar";
import MapWrapper from "@/components/map/MapWrapper";
import type { Station } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";
import { Radio, Wifi, WifiOff } from "lucide-react";

export default function HomePage() {
  const { station } = useWeather();
  const stations: Station[] = station ? [station] : [];
  const onlineCount = stations.filter((s) => s.status === "online").length;
  const offlineCount = stations.filter((s) => s.status === "offline").length;

  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />

      {/* Map fills remaining viewport */}
      <main className="relative flex-1 pt-14">
        <MapWrapper />

        {/* Floating Station Summary Panel */}
        <div
          id="station-summary-panel"
          className="absolute bottom-6 left-4 z-[500] sm:left-6"
        >
          <div className="rounded-xl border border-border/50 bg-card/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-2.5 flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-semibold">Ikhtisar Stasiun</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3 text-emerald-400" />
                <span className="text-muted-foreground">Aktif</span>
                <span className="ml-0.5 font-semibold text-emerald-400">
                  {onlineCount}
                </span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <WifiOff className="h-3 w-3 text-red-400" />
                <span className="text-muted-foreground">Nonaktif</span>
                <span className="ml-0.5 font-semibold text-red-400">
                  {offlineCount}
                </span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Total</span>
                <span className="ml-0.5 font-semibold">
                  {stations.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Legend */}
        <div
          id="map-legend"
          className="absolute bottom-6 right-4 z-[500] hidden sm:right-6 sm:block"
        >
          <div className="rounded-xl border border-border/50 bg-card/90 p-3 shadow-2xl backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Legenda
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <span className="text-muted-foreground">Stasiun Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
                <span className="text-muted-foreground">
                  Stasiun Nonaktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
