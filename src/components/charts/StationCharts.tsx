"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WeatherData } from "@/types/weather";
import { formatToWIB } from "@/lib/utils";

interface StationChartsProps {
  timeSeries: WeatherData[];
}

// Format timestamp for chart axis labels
function formatTime(isoString: string): string {
  return formatToWIB(isoString, "time");
}

// Custom tooltip for the charts
function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
  unit: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const formatted = label ? formatToWIB(label, "full") : formatToWIB(new Date().toISOString(), "full");

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{formatted}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {unit}
        </p>
      ))}
    </div>
  );
}

// Sample every Nth data point to avoid overcrowding the chart
function downsample(data: WeatherData[], maxPoints: number = 72): WeatherData[] {
  if (!data || data.length === 0) return [];
  if (data.length <= maxPoints) return data;
  const step = Math.floor(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}

// Shared chart axis and grid configuration
function SharedXAxis() {
  return (
    <XAxis
      dataKey="timestamp"
      tickFormatter={formatTime}
      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
      tickLine={false}
      axisLine={{ stroke: "var(--border)" }}
      interval="preserveStartEnd"
      minTickGap={40}
    />
  );
}

export function TemperatureChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" C"
          domain={["auto", "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="C" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="temperature"
          name="Suhu"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HumidityChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" %"
          domain={[0, 100]}
        />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="humidity"
          name="Kelembaban"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PressureChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" hPa"
          domain={["auto", "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="hPa" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="pressure"
          name="Tekanan"
          stroke="#a855f7"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RainChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" mm"
          domain={[0, "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="mm" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="rain"
          name="Curah Hujan"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function UVIndexChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          domain={[0, "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="uv_index"
          name="Indeks UV"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PM1Chart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" ug"
          domain={[0, "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="ug/m3" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="pm1"
          name="PM1.0"
          stroke="#e11d48"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PM25Chart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <SharedXAxis />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" ug"
          domain={[0, "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="ug/m3" />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="pm2_5"
          name="PM2.5"
          stroke="#d97706"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
