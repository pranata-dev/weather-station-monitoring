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
