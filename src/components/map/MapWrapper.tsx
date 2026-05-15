"use client";

import dynamic from "next/dynamic";
import { Radio } from "lucide-react";

const StationMap = dynamic(() => import("@/components/map/StationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-blue-500" />
          <Radio className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">Memuat data peta...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper() {
  return <StationMap />;
}
