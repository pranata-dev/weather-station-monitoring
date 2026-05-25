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

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChartsWrapperProps {
  timeSeries: WeatherData[];
}

export default function ChartsWrapper({ timeSeries }: ChartsWrapperProps) {
  const [timeframe, setTimeframe] = useState<number>(24);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredTimeSeries = useMemo(() => {
    if (!timeSeries || timeSeries.length === 0) return [];
    
    let endBoundary: Date;
    if (selectedDate) {
      endBoundary = new Date(`${selectedDate}T23:59:59`);
    } else {
      endBoundary = new Date();
    }

    const startBoundary = new Date(endBoundary.getTime() - timeframe * 60 * 60 * 1000);

    return timeSeries.filter((item) => {
      const itemDate = new Date(item.timestamp + "Z");
      return itemDate >= startBoundary && itemDate <= endBoundary;
    });
  }, [timeSeries, timeframe, selectedDate]);

  if (!timeSeries || timeSeries.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Belum ada data historis (No data available)</p>
      </div>
    );
  }

  const timeframes = [
    { label: "1 Jam", value: 1 },
    { label: "6 Jam", value: 6 },
    { label: "12 Jam", value: 12 },
    { label: "24 Jam", value: 24 },
    { label: "3 Hari", value: 72 },
    { label: "7 Hari", value: 168 },
  ];

  const getLabel = () => timeframes.find(t => t.value === timeframe)?.label || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-6 rounded-xl border border-border bg-card p-4">
        <div className="grid gap-2">
          <Label htmlFor="date-picker">Tanggal Referensi</Label>
          <div className="flex items-center gap-2">
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-[150px]"
            />
            {selectedDate && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate("")}>
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label>Rentang Waktu</Label>
          <div className="flex flex-wrap items-center gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredTimeSeries.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          <p>Tidak ada data pada rentang waktu ini.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-1">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Suhu ({getLabel()})</h3>
            <TemperatureChart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Kelembaban ({getLabel()})</h3>
            <HumidityChart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Tekanan Udara ({getLabel()})</h3>
            <PressureChart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Curah Hujan ({getLabel()})</h3>
            <RainChart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Indeks UV ({getLabel()})</h3>
            <UVIndexChart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">PM1.0 ({getLabel()})</h3>
            <PM1Chart timeSeries={filteredTimeSeries} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">PM2.5 ({getLabel()})</h3>
            <PM25Chart timeSeries={filteredTimeSeries} />
          </div>
        </div>
      )}
    </div>
  );
}
