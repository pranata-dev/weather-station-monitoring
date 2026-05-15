"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  LayoutDashboard,
  Map,
  MoreVertical,
  Plus,
  Settings,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navLinks = [
  { href: "/", label: "Peta Langsung", icon: Map },
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [addStationOpen, setAddStationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-[1000] border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-4 sm:px-6">
          {/* Left: Logo */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Radio className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-base font-semibold tracking-tight sm:inline">
                Pemantauan Stasiun Cuaca
              </span>
              <span className="text-base font-semibold tracking-tight sm:hidden">
                PSC
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Theme toggle + kebab menu */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="kebab-menu-trigger"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Opsi lainnya"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  id="add-station-menu-item"
                  onSelect={() => setAddStationOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Tambah Stasiun Cuaca
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                  <Settings className="h-4 w-4" />
                  Pengaturan Sistem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Add Weather Station Dialog */}
      <Dialog open={addStationOpen} onOpenChange={setAddStationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Daftarkan Stasiun Cuaca Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail perangkat stasiun cuaca baru. Semua kolom
              akan divalidasi terhadap registrasi perangkat keras saat pengiriman.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="station-name">Nama Stasiun</Label>
              <Input id="station-name" placeholder="cth., Unit Observasi Atap A" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mac-address">Alamat MAC Perangkat</Label>
              <Input id="mac-address" placeholder="cth., A4:CF:12:8B:3E:04" className="font-mono" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="station-location">Lokasi Stasiun</Label>
              <Input id="station-location" placeholder="cth., -6.2088, 106.8456 atau Kantor Pusat Jakarta" />
              <p className="text-xs text-muted-foreground">
                Masukkan koordinat (lat, lng) atau nama lokasi deskriptif.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStationOpen(false)}>Batal</Button>
            <Button onClick={() => setAddStationOpen(false)}>
              <MapPin className="h-4 w-4" />
              Daftarkan Stasiun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Sistem</DialogTitle>
            <DialogDescription>
              Konfigurasi preferensi platform dan aturan notifikasi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-foreground">
                Bagian ini akan mengelola pengaturan umum termasuk:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Interval pembaruan data untuk umpan stasiun secara real-time
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Preferensi notifikasi untuk peringatan stasiun offline
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Preferensi satuan cuaca (Celsius / Fahrenheit, hPa / inHg)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Manajemen kunci API dan integrasi pihak ketiga
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
