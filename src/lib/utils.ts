import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToWIB(timestamp: string | null | undefined, format: "full" | "time" = "full"): string {
  try {
    if (!timestamp) return "--";
    
    const utcTimestamp = timestamp.endsWith("Z") || timestamp.includes("+") ? timestamp : `${timestamp}Z`;
    const date = new Date(utcTimestamp);
    
    if (isNaN(date.getTime())) {
      return "--";
    }

    if (format === "time") {
      return new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date).replace(/\./g, ":");
    }

    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date).replace(" pukul ", ", ").replace(/\./g, ":");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "--";
  }
}

export function downloadCSV(data: any[], metricId: string, metricUnit: string, stationId: string) {
  if (!data || data.length === 0) return;

  let csv = "Timestamp (WIB),Value (Unit)\n";
  data.forEach((row) => {
    const timestampWIB = formatToWIB(row.timestamp, "full").replace(/,/g, "");
    const val = row[metricId];
    const valStr = val !== null && val !== undefined ? String(val) : "";
    csv += `${timestampWIB},${valStr} ${metricUnit}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  
  // Format the date for the filename: YYYYMMDD
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  link.setAttribute("download", `export-${stationId}-${metricId}-${dateStr}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
