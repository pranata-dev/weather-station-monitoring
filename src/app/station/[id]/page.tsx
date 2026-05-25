"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Station, WeatherData } from "@/types/weather";
import { formatToWIB } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import ChartsWrapper from "@/components/charts/ChartsWrapper";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Compass,
  CloudRain,
  Zap,
  SunDim,
  Activity,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  Sun,
  CloudSun,
  Sunset,
  Moon,
} from "lucide-react";
import { HistoricalDataDialog } from "@/components/dialogs/HistoricalDataDialog";

const SingleStationMap = dynamic(
  () => import("@/components/map/SingleStationMap"),
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export default function StationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMetric, setSelectedMetric] = useState<{
    id: string;
    title: string;
    unit: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setError(null);
        
        const [latestRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/sensor/latest`),
          fetch(`${API_URL}/api/v1/sensor/history?limit=288`)
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
            timeSeries: (() => {
              const oneDayAgo = new Date();
              oneDayAgo.setHours(oneDayAgo.getHours() - 24);
              const rawData = historyData.data || [];
              return rawData.filter((row: any) => {
                const ts = row.timestamp?.endsWith("Z") || row.timestamp?.includes("+")
                  ? row.timestamp
                  : `${row.timestamp}Z`;
                return new Date(ts) >= oneDayAgo;
              });
            })(),
          });
        }
      } catch (err) {
        if (isMounted) {
          setError("Connection Error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleMetricClick = (
    e: React.MouseEvent,
    metricId: string,
    title: string,
    unit: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMetric({ id: metricId, title, unit });
    setIsDialogOpen(true);
  };

  const currentStation: Station = station || {
    id,
    name: `Stasiun ${id}`,
    location: "Lokasi Belum Diketahui",
    status: "offline",
    coordinates: [0, 0],
    latestData: null,
    timeSeries: [],
  };

  const lastSeenFormatted = currentStation.latestData?.timestamp
    ? formatToWIB(currentStation.latestData.timestamp, "full")
    : "Belum ada data";

  const metrics = [
    {
      id: "temperature",
      label: "Suhu",
      value: currentStation.latestData?.temperature ?? "--",
      unit: "C",
      icon: Thermometer,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: "humidity",
      label: "Kelembaban",
      value: currentStation.latestData?.humidity ?? "--",
      unit: "%",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "pressure",
      label: "Tekanan Udara",
      value: currentStation.latestData?.pressure ?? "--",
      unit: "hPa",
      icon: Gauge,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "wind_speed",
      label: "Kecepatan Angin",
      value: currentStation.latestData?.wind_speed ?? "--",
      unit: "km/h",
      icon: Wind,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      id: "wind_direction",
      label: "Arah Angin",
      value: currentStation.latestData?.wind_direction ?? "--",
      unit: "deg",
      icon: Compass,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      id: "solar_radiation",
      label: "Radiasi Matahari",
      value: currentStation.latestData?.solar_radiation ?? "--",
      unit: "W/m2",
      icon: SunDim,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "uv_index",
      label: "Indeks UV",
      value: currentStation.latestData?.uv_index ?? "--",
      unit: "",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: "rain",
      label: "Curah Hujan",
      value: currentStation.latestData?.rain ?? "--",
      unit: "mm",
      icon: CloudRain,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
    {
      id: "pm1",
      label: "PM1.0",
      value: currentStation.latestData?.pm1 ?? "--",
      unit: "ug/m3",
      icon: Activity,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      id: "pm2_5",
      label: "PM2.5",
      value: currentStation.latestData?.pm2_5 ?? "--",
      unit: "ug/m3",
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-screen-xl px-4 pb-12 pt-20 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Peta
        </Link>

        {isLoading ? (
          <div className="mb-8 py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p>Memuat data stasiun...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mb-8 py-12 text-center text-destructive border border-dashed border-destructive/50 bg-destructive/5 rounded-xl">
            <p className="font-semibold">System Offline</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        ) : (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {currentStation.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    currentStation.status === "online"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {currentStation.status === "online" ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  {currentStation.status === "online" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {currentStation.location}
                </span>
                {(() => {
                  const timeInfo = getTimeOfDayInfo(currentStation.latestData?.timestamp);
                  return timeInfo ? (
                    <span className="flex items-center gap-1.5">
                      {timeInfo.icon}
                      <span className="font-sans font-medium">{timeInfo.text}</span>
                    </span>
                  ) : null;
                })()}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Terakhir terlihat: {lastSeenFormatted}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <p className="text-xs text-muted-foreground">ID Stasiun</p>
              <p className="font-mono text-sm font-semibold">{currentStation.id}</p>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Metrik Saat Ini</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:bg-accent/50 cursor-pointer"
                  onClick={(e) => handleMetricClick(e, metric.id, metric.label, metric.unit)}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${metric.bgColor}`}
                    >
                      <metric.icon className={`h-3.5 w-3.5 ${metric.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums">
                    {metric.value}
                    {metric.unit && (
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Lokasi Stasiun</h2>
            <SingleStationMap station={currentStation} />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tren Historis</h2>
          <p className="text-sm text-muted-foreground">
            Pembacaan sensor selama 24 jam terakhir (interval 5 menit)
          </p>
        </div>
        <ChartsWrapper timeSeries={currentStation.timeSeries} />

        {/* Modal Data Historis */}
      <HistoricalDataDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedMetric={selectedMetric}
        timeSeries={currentStation?.timeSeries || []}
      />

      </main>
    </div>
  );
}
