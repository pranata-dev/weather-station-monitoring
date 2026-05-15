"use client";

import dynamic from "next/dynamic";
import { type TimeSeriesPoint } from "@/lib/mockData";

const TemperatureChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.TemperatureChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const HumidityChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.HumidityChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

const PressureChart = dynamic(
  () => import("@/components/charts/StationCharts").then((mod) => mod.PressureChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

function ChartSkeleton() {
  return (
    <div className="flex h-[280px] items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-blue-500" />
    </div>
  );
}

interface ChartsWrapperProps {
  timeSeries: TimeSeriesPoint[];
}

export default function ChartsWrapper({ timeSeries }: ChartsWrapperProps) {
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
    </div>
  );
}
