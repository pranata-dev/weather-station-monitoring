"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { formatToWIB } from "@/lib/utils";
import type { Station } from "@/types/weather";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StationAccessDialog } from "@/components/dialogs/StationAccessDialog";
import { useWeather } from "@/hooks/useWeather";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Compass,
  CloudRain,
  Zap,
  SunDim,
  Activity,
  MapPin,
  ExternalLink,
  Radio,
  Wifi,
  WifiOff,
  Sun,
  CloudSun,
  Sunset,
  Moon,
} from "lucide-react";

function getTimeOfDayInfo(timestamp: string | null | undefined) {
  if (!timestamp) return null;
  const utcTimestamp = timestamp.endsWith("Z") || timestamp.includes("+") ? timestamp : `${timestamp}Z`;
  const date = new Date(utcTimestamp);
  if (isNaN(date.getTime())) return null;

  const wibTime = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  }).format(date);

  const [hourStr, minStr] = wibTime.replace(/\./g, ":").split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);
  const totalMinutes = hour * 60 + minute;

  // 05:00 (300) to 11:59 (719) -> Pagi
  // 12:00 (720) to 14:59 (899) -> Siang
  // 15:00 (900) to 18:29 (1109) -> Sore
  // 18:30 (1110) to 04:59 (299) -> Malam

  if (totalMinutes >= 300 && totalMinutes <= 719) {
    return { text: "Pagi", icon: <CloudSun className="w-6 h-6 text-sky-400" /> };
  } else if (totalMinutes >= 720 && totalMinutes <= 899) {
    return { text: "Siang", icon: <Sun className="w-6 h-6 text-yellow-500" /> };
  } else if (totalMinutes >= 900 && totalMinutes <= 1109) {
    return { text: "Sore", icon: <Sunset className="w-6 h-6 text-orange-500" /> };
  } else {
    return { text: "Malam", icon: <Moon className="w-6 h-6 text-slate-400" /> };
  }
}

export default function DashboardPage() {
  const { stations, isLoading, error } = useWeather();
  
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const onlineCount = stations.filter((s) => s.status === "online").length;
  const offlineCount = stations.filter((s) => s.status === "offline").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-screen-xl px-4 pb-12 pt-20 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Stasiun
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gambaran umum semua stasiun cuaca terdaftar dan status terkini.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stasiun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold">{stations.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-emerald-500" />
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {onlineCount}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nonaktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-red-500" />
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {offlineCount}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Cards Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Stasiun Terdaftar</h2>
          <p className="text-sm text-muted-foreground">
            Klik pada stasiun cuaca yang diinginkan untuk melihat data dan informasi lebih lanjut.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p>Memuat data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full py-12 text-center text-destructive border border-dashed border-destructive/50 bg-destructive/5 rounded-xl">
              <p className="font-semibold">System Offline</p>
              <p className="text-sm mt-1 opacity-80">{error}</p>
            </div>
          ) : stations.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <p>Belum ada data stasiun (No data available)</p>
            </div>
          ) : (
            stations.map((station) => (
              <div key={station.id} className="group block h-full">
                <Card className="h-full py-4 transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">
                          {station.name}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {station.location}
                        </div>
                      </div>
                      <Badge
                        variant={station.status === "online" ? "default" : "destructive"}
                        className={
                          station.status === "online"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/15"
                            : "bg-red-500/15 text-red-600 dark:text-red-400 border-0 hover:bg-red-500/15"
                        }
                      >
                        {station.status === "online" ? (
                          <Wifi className="mr-1 h-3 w-3" />
                        ) : (
                          <WifiOff className="mr-1 h-3 w-3" />
                        )}
                        {station.status === "online" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>{station.id}</span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const timeInfo = getTimeOfDayInfo(station.latestData?.timestamp);
                          return timeInfo ? (
                            <div className="flex items-center gap-1">
                              {timeInfo.icon}
                              <span className="font-sans font-medium">{timeInfo.text}</span>
                            </div>
                          ) : null;
                        })()}
                        <span>{station.latestData?.timestamp ? formatToWIB(station.latestData.timestamp, "full") : "--"}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { id: "temperature", label: "Suhu", value: station.latestData?.temperature, unit: "C", icon: Thermometer, color: "text-red-500" },
                        { id: "humidity", label: "Kelembaban", value: station.latestData?.humidity, unit: "%", icon: Droplets, color: "text-blue-500" },
                        { id: "pressure", label: "Tekanan", value: station.latestData?.pressure, unit: "hPa", icon: Gauge, color: "text-purple-500" },
                        { id: "wind_speed", label: "Angin", value: station.latestData?.wind_speed, unit: "km/h", icon: Wind, color: "text-teal-500" },
                        { id: "wind_direction", label: "Arah Angin", value: station.latestData?.wind_direction, unit: "deg", icon: Compass, color: "text-cyan-500" },
                        { id: "solar_radiation", label: "Radiasi", value: station.latestData?.solar_radiation, unit: "W/m2", icon: SunDim, color: "text-orange-500" },
                        { id: "uv_index", label: "UV Index", value: station.latestData?.uv_index, unit: "", icon: Zap, color: "text-yellow-500" },
                        { id: "rain", label: "Hujan", value: station.latestData?.rain, unit: "mm", icon: CloudRain, color: "text-sky-500" },
                        { id: "pm1", label: "PM1.0", value: station.latestData?.pm1, unit: "ug/m3", icon: Activity, color: "text-rose-500" },
                        { id: "pm2_5", label: "PM2.5", value: station.latestData?.pm2_5, unit: "ug/m3", icon: Activity, color: "text-amber-500" },
                      ].map((metric) => (
                        <div
                          key={metric.id}
                          className="rounded-lg bg-muted/60 p-2.5 cursor-default overflow-hidden"
                        >
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                            <metric.icon className={`h-3 w-3 shrink-0 ${metric.color}`} />
                            <span className="truncate">{metric.label}</span>
                          </div>
                          <p className="mt-0.5 text-xs font-semibold tabular-nums tracking-tighter truncate">
                            {metric.value ?? "--"}
                            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{metric.unit}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStationId(station.id);
                        setIsAccessDialogOpen(true);
                      }}
                      className="mt-3 flex w-full items-center justify-end text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      Lihat Detail
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        <StationAccessDialog
          open={isAccessDialogOpen}
          onOpenChange={setIsAccessDialogOpen}
          stationId={selectedStationId}
        />

      </main>
    </div>
  );
}
