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
import { type TimeSeriesPoint } from "@/lib/mockData";

interface StationChartsProps {
  timeSeries: TimeSeriesPoint[];
}

// Format timestamp for chart axis labels
function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
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

  const date = label ? new Date(label) : new Date();
  const formatted = date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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
function downsample(data: TimeSeriesPoint[], maxPoints: number = 72): TimeSeriesPoint[] {
  if (data.length <= maxPoints) return data;
  const step = Math.floor(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}

export function TemperatureChart({ timeSeries }: StationChartsProps) {
  const data = downsample(timeSeries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" C"
          domain={["auto", "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="C" />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
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
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" %"
          domain={[0, 100]}
        />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
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
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          unit=" hPa"
          domain={["auto", "auto"]}
        />
        <Tooltip content={<ChartTooltip unit="hPa" />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
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
