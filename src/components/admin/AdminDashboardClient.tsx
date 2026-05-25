"use client";

import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { logoutAdmin } from "@/app/admin/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, LogOut, Radio, Wifi, WifiOff, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AdminDashboardClient() {
  const { stations = [], isLoading, error } = useWeather();
  
  const onlineCount = stations.filter(s => s.status === "online").length;
  const offlineCount = stations.filter(s => s.status === "offline").length;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    station_code: "",
    name: "",
    api_key: "",
    location: "",
    access_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/v1/stations/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mendaftarkan stasiun");
      }

      setSuccessMsg(`Stasiun berhasil didaftarkan! API Key terdaftar.`);
      setFormData({
        station_code: "",
        name: "",
        api_key: "",
        location: "",
        access_password: "",
      });
      // Close dialog after a short delay
      setTimeout(() => setIsDialogOpen(false), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Command Center
            </h1>
            <p className="text-muted-foreground mt-1">Kelola stasiun cuaca dan pantau status jaringan.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Stasiun</CardTitle>
              <Radio className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Aktif (Online)</CardTitle>
              <Wifi className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{onlineCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Perlu Perbaikan (Offline)</CardTitle>
              <WifiOff className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{offlineCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Station List and Registration */}
        <Card className="border-border">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Stasiun Terdaftar</CardTitle>
              <CardDescription>Semua stasiun yang terhubung ke jaringan telemetri.</CardDescription>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Stasiun Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrasi Stasiun Baru</DialogTitle>
                  <DialogDescription>
                    Daftarkan stasiun cuaca baru. API Key harus sama dengan yang diprogram pada ESP32.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  {successMsg && (
                    <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20 font-medium">
                      {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="p-3 text-sm text-red-600 bg-red-500/10 rounded-md border border-red-500/20 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="station_code">Kode Stasiun</Label>
                    <Input id="station_code" name="station_code" placeholder="e.g. ST-02" required value={formData.station_code} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Stasiun</Label>
                    <Input id="name" name="name" placeholder="e.g. Stasiun IPB" required value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_key">Device Token (API Key / Passkey)</Label>
                    <Input id="api_key" name="api_key" placeholder="32-character MD5 hash" required value={formData.api_key} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <Input id="location" name="location" placeholder="e.g. Bogor, Indonesia" required value={formData.location} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access_password">Password Akses Dasbor</Label>
                    <Input id="access_password" name="access_password" type="password" required value={formData.access_password} onChange={handleChange} />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Daftarkan Stasiun"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : stations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Belum ada stasiun terdaftar.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stations.map((station) => (
                      <TableRow key={station.id}>
                        <TableCell>
                          {station.status === "online" ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Online</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Offline</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{station.id}</TableCell>
                        <TableCell>{station.name}</TableCell>
                        <TableCell className="text-muted-foreground">{station.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/station/${station.id}`}>Lihat Detail</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
