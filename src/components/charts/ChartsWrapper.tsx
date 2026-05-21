"use client";

import dynamic from "next/dynamic";
import type { WeatherData } from "@/types/weather";

const TemperatureChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.TemperatureChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const HumidityChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.HumidityChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const PressureChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.PressureChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const RainChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.RainChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const UVIndexChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.UVIndexChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const PM1Chart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.PM1Chart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const PM25Chart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.PM25Chart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="flex h-[280px] items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-blue-500" />
    </div>
  );
}

interface ChartsWrapperProps {
  timeSeries: WeatherData[];
}

export default function ChartsWrapper({ timeSeries }: ChartsWrapperProps) {
  if (!timeSeries || timeSeries.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Belum ada data historis (No data available)</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-1">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">Suhu (24 jam)</h3>
        <TemperatureChart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">Kelembaban (24 jam)</h3>
        <HumidityChart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">Tekanan Udara (24 jam)</h3>
        <PressureChart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">Curah Hujan (24 jam)</h3>
        <RainChart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">Indeks UV (24 jam)</h3>
        <UVIndexChart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">PM1.0 (24 jam)</h3>
        <PM1Chart timeSeries={timeSeries} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold">PM2.5 (24 jam)</h3>
        <PM25Chart timeSeries={timeSeries} />
      </div>
    </div>
  );
}
