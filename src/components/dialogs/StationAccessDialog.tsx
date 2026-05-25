"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";

interface StationAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: string | null;
}

export function StationAccessDialog({
  open,
  onOpenChange,
  stationId,
}: StationAccessDialogProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword("");
      setPasswordError("");
    }
    onOpenChange(newOpen);
  };

  const verifyAndNavigate = async () => {
    if (!stationId) return;

    setIsVerifying(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/verify-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stationId,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Gagal memverifikasi password.");
        setIsVerifying(false);
        return;
      }

      // Success - close dialog and navigate
      handleOpenChange(false);
      router.push(`/station/${stationId}`);
    } catch (err) {
      setPasswordError("Kesalahan jaringan, coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Verifikasi Akses</DialogTitle>
          <DialogDescription>
            Masukkan password untuk mengakses dasbor stasiun {stationId}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="station-password">Password</Label>
            <Input
              id="station-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyAndNavigate();
              }}
            />
            {passwordError && (
              <p className="text-sm text-red-500 font-medium">{passwordError}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={verifyAndNavigate} disabled={isVerifying || !password}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Lanjutkan"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
