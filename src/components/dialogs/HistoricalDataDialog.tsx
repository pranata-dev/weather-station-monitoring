"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatToWIB, downloadCSV } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
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

  const [visibleCount, setVisibleCount] = useState(10);

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

  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const handleDownloadClick = () => {
    if (!selectedMetric || filteredData.length === 0) return;
    downloadCSV(filteredData, selectedMetric.id, selectedMetric.unit, "ST-01");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Data Historis - {selectedMetric?.title}</DialogTitle>
          <DialogDescription className="hidden">
            Tabel riwayat data telemetri untuk {selectedMetric?.title}
          </DialogDescription>
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
              onClick={handleDownloadClick}
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
                {visibleData.length > 0 ? (
                  visibleData.map((row, idx) => {
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
            
            {visibleCount < filteredData.length && (
              <div className="p-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Lihat selengkapnya
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
