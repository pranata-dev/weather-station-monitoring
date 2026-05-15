import Link from "next/link";
import { getStationById, stations } from "@/lib/mockData";
import Navbar from "@/components/layout/Navbar";
import ChartsWrapper from "@/components/charts/ChartsWrapper";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Sun,
  CloudRain,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
} from "lucide-react";

// Pre-generate static params for all stations
export function generateStaticParams() {
  return stations.map((station) => ({
    id: station.id,
  }));
}

export default async function StationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = getStationById(id);

  if (!station) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-14">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Stasiun Tidak Ditemukan</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tidak ada stasiun yang cocok dengan ID &quot;{id}&quot;.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Peta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lastSeenDate = new Date(station.lastSeen);
  const lastSeenFormatted = lastSeenDate.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const metrics = [
    {
      label: "Suhu",
      value: station.current.temperature,
      unit: "C",
      icon: Thermometer,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Kelembaban",
      value: station.current.humidity,
      unit: "%",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Tekanan Udara",
      value: station.current.pressure,
      unit: "hPa",
      icon: Gauge,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Kecepatan Angin",
      value: station.current.windSpeed,
      unit: "km/h",
      icon: Wind,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      label: "Indeks UV",
      value: station.current.uvIndex,
      unit: "",
      icon: Sun,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Curah Hujan",
      value: station.current.rainfall,
      unit: "mm",
      icon: CloudRain,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-screen-xl px-4 pb-12 pt-20 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Peta
        </Link>

        {/* Station Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {station.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  station.status === "online"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {station.status === "online" ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {station.status === "online" ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {station.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Terakhir terlihat: {lastSeenFormatted}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-2">
            <p className="text-xs text-muted-foreground">ID Stasiun</p>
            <p className="font-mono text-sm font-semibold">{station.id}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
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

        {/* Historical Charts */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tren Historis</h2>
          <p className="text-sm text-muted-foreground">
            Pembacaan sensor selama 24 jam terakhir (interval 5 menit)
          </p>
        </div>
        <ChartsWrapper timeSeries={station.timeSeries} />
      </main>
    </div>
  );
}
