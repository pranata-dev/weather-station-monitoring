"use client";

import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { logoutAdmin } from "@/app/admin/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, LogOut, Radio, Wifi, WifiOff, Plus, Pencil } from "lucide-react";
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
import MapGL, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const LIGHT_STYLE = "https://tiles.versatiles.org/assets/styles/colorful/style.json";
const DARK_STYLE = "https://tiles.versatiles.org/assets/styles/eclipse/style.json";

export function AdminDashboardClient() {
  const { resolvedTheme } = useTheme();
  const { stations = [], isLoading, error, refetch } = useWeather();

  const onlineCount = stations.filter(s => s.status === "online").length;
  const offlineCount = stations.filter(s => s.status === "offline").length;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    station_code: "",
    name: "",
    location: "",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    station_code: "",
    name: "",
    api_key: "",
    location: "",
    access_password: "",
    default_lat: -0.7893,
    default_lon: 113.9213,
  });

  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (station: any) => {
    setEditFormData({
      station_code: station.id,
      name: station.name,
      location: station.location,
    });
    setEditSuccessMsg("");
    setEditErrorMsg("");
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
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
        default_lat: -0.7893,
        default_lon: 113.9213,
      });
      // Close dialog after a short delay
      setTimeout(() => setIsDialogOpen(false), 2000);
      refetch();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditSubmitting(true);
    setEditSuccessMsg("");
    setEditErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/v1/stations/update/${editFormData.station_code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editFormData.name,
          location: editFormData.location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mengupdate stasiun");
      }

      setEditSuccessMsg("Stasiun berhasil diupdate!");
      refetch();
      setTimeout(() => setIsEditDialogOpen(false), 2000);
    } catch (err: any) {
      setEditErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsEditSubmitting(false);
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
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      Lokasi (Teks)
                      {isGeocoding && <span className="text-xs text-muted-foreground animate-pulse">Mencari lokasi...</span>}
                    </Label>
                    <Input id="location" name="location" placeholder={isGeocoding ? "Mencari lokasi..." : "e.g. Bogor, Indonesia"} required value={isGeocoding ? "Mencari lokasi..." : formData.location} onChange={handleChange} disabled={isGeocoding} />
                  </div>

                  <div className="space-y-2">
                    <Label>Pilih Titik Lokasi di Peta</Label>
                    <div className="h-[250px] w-full overflow-hidden rounded-md border border-border">
                      <MapGL
                        initialViewState={{
                          longitude: 113.9213,
                          latitude: -0.7893,
                          zoom: 3.5,
                        }}
                        mapStyle={resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE}
                        attributionControl={false}
                        onClick={async (e) => {
                          const lat = e.lngLat.lat;
                          const lon = e.lngLat.lng;
                          setFormData(prev => ({
                            ...prev,
                            default_lat: lat,
                            default_lon: lon,
                          }));
                          
                          setIsGeocoding(true);
                          try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
                              headers: { 'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7' }
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data && data.address) {
                                const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district;
                                const state = data.address.state;
                                let locationName = "";
                                if (city && state) {
                                  locationName = `${city}, ${state}`;
                                } else if (data.display_name) {
                                  const parts = data.display_name.split(", ");
                                  locationName = parts.slice(0, 2).join(", ");
                                }
                                if (locationName) {
                                  setFormData(prev => ({ ...prev, location: locationName }));
                                }
                              }
                            }
                          } catch (err) {
                            console.error("Reverse geocoding failed", err);
                          } finally {
                            setIsGeocoding(false);
                          }
                        }}
                      >
                        <NavigationControl position="top-right" showCompass={false} />
                        <Marker
                          longitude={formData.default_lon}
                          latitude={formData.default_lat}
                          anchor="bottom"
                        >
                          <div className="h-4 w-4 rounded-full border-2 border-white bg-red-500 shadow-md" />
                        </Marker>
                      </MapGL>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Latitude</Label>
                        <Input readOnly value={formData.default_lat.toFixed(6)} className="h-8 text-xs bg-muted" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Longitude</Label>
                        <Input readOnly value={formData.default_lon.toFixed(6)} className="h-8 text-xs bg-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access_password">Password Akses Dashboard</Label>
                    <Input id="access_password" name="access_password" type="password" required value={formData.access_password} onChange={handleChange} />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Daftarkan Stasiun"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Stasiun</DialogTitle>
                  <DialogDescription>
                    Perbarui nama atau lokasi stasiun.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                  {editSuccessMsg && (
                    <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20 font-medium">
                      {editSuccessMsg}
                    </div>
                  )}
                  {editErrorMsg && (
                    <div className="p-3 text-sm text-red-600 bg-red-500/10 rounded-md border border-red-500/20 font-medium">
                      {editErrorMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Kode Stasiun</Label>
                    <Input disabled value={editFormData.station_code} className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_name">Nama Stasiun</Label>
                    <Input id="edit_name" name="name" placeholder="e.g. Stasiun IPB" required value={editFormData.name} onChange={handleEditChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_location">Lokasi</Label>
                    <Input id="edit_location" name="location" placeholder="e.g. Bogor, Indonesia" required value={editFormData.location} onChange={handleEditChange} />
                  </div>
                  <Button type="submit" disabled={isEditSubmitting} className="w-full">
                    {isEditSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
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
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(station)} title="Edit Stasiun">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="ml-2">
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
