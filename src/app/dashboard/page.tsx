import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { stations } from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  ExternalLink,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function DashboardPage() {
  const onlineCount = stations.filter((s) => s.status === "online").length;
  const offlineCount = stations.filter((s) => s.status === "offline").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-screen-xl px-4 pb-12 pt-20 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Dasbor Stasiun
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
          {stations.map((station) => (
            <Link
              key={station.id}
              href={`/station/${station.id}`}
              className="group block"
            >
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
                  <div className="mb-3 text-xs font-mono text-muted-foreground">
                    {station.id}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/60 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Thermometer className="h-3 w-3 text-red-500" />
                        Suhu
                      </div>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums">
                        {station.current.temperature}
                        <span className="text-[10px] font-normal text-muted-foreground"> C</span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/60 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        Kelembaban
                      </div>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums">
                        {station.current.humidity}
                        <span className="text-[10px] font-normal text-muted-foreground"> %</span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/60 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Gauge className="h-3 w-3 text-purple-500" />
                        Tekanan Udara
                      </div>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums">
                        {station.current.pressure}
                        <span className="text-[10px] font-normal text-muted-foreground"> hPa</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Lihat Detail
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
