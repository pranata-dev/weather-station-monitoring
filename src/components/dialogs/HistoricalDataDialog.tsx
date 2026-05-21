"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatToWIB } from "@/lib/utils";
import { Download } from "lucide-react";
import type { WeatherData } from "@/types/weather";

interface HistoricalDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMetric: { id: string; title: string; unit: string } | null;
  timeSeries: WeatherData[];
}

export function HistoricalDataDialog({
  open,
  onOpenChange,
  selectedMetric,
  timeSeries,
}: HistoricalDataDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const filteredData = useMemo(() => {
    if (!timeSeries || timeSeries.length === 0) return [];

    return timeSeries.filter((row) => {
      // Create a Date object from the UTC timestamp
      const utcTimestamp = row.timestamp.endsWith("Z") || row.timestamp.includes("+") 
        ? row.timestamp 
        : `${row.timestamp}Z`;
      const date = new Date(utcTimestamp);
      
      if (isNaN(date.getTime())) return false;

      // Get YYYY-MM-DD and HH:mm in Asia/Jakarta timezone
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
      
      const rowDate = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
      const rowTime = `${getPart("hour")}:${getPart("minute")}`;

      if (startDate && rowDate < startDate) return false;
      if (endDate && rowDate > endDate) return false;
      if (startTime && rowTime < startTime) return false;
      if (endTime && rowTime > endTime) return false;

      return true;
    });
  }, [timeSeries, startDate, endDate, startTime, endTime]);

  const handleDownload = () => {
    if (!selectedMetric || filteredData.length === 0) return;

    let csv = "Timestamp (WIB),Value (Unit)\n";
    filteredData.forEach((row) => {
      const timestampWIB = formatToWIB(row.timestamp, "full").replace(/,/g, "");
      const val = row[selectedMetric.id as keyof WeatherData];
      const valStr = val !== null && val !== undefined ? String(val) : "";
      csv += `${timestampWIB},${valStr} ${selectedMetric.unit}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `raw_${selectedMetric.id}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Data Historis - {selectedMetric?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-1.5">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-[150px]"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-[150px]"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="startTime">Jam Mulai</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full sm:w-[120px]"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="endTime">Jam Selesai</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full sm:w-[120px]"
              />
            </div>
            <Button 
              onClick={handleDownload}
              disabled={filteredData.length === 0}
              className="ml-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Unduh RAW Data
            </Button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 text-left font-medium">Waktu (WIB)</th>
                  <th className="p-3 text-right font-medium">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) => {
                    const val = selectedMetric ? row[selectedMetric.id as keyof WeatherData] : null;
                    return (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {formatToWIB(row.timestamp, "full")}
                        </td>
                        <td className="p-3 text-right tabular-nums font-medium">
                          {val !== null && val !== undefined ? String(val) : "--"}
                          <span className="text-xs ml-1 text-muted-foreground font-normal">
                            {selectedMetric?.unit}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                      Tidak ada data pada rentang waktu ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
