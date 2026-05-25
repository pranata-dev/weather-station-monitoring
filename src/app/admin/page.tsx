"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    station_code: "",
    name: "",
    mac_address: "",
    location: "",
    access_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      setSuccessMsg(`Stasiun berhasil didaftarkan! API Key (HASH): ${data.api_key}`);
      setFormData({
        station_code: "",
        name: "",
        mac_address: "",
        location: "",
        access_password: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 pt-24 max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Peta
        </Link>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">Registrasi Stasiun Baru</CardTitle>
            </div>
            <CardDescription>
              Daftarkan stasiun cuaca baru ke dalam sistem untuk memonitor telemetri.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMsg && (
                <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20 font-medium break-all">
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
                <Input
                  id="station_code"
                  name="station_code"
                  placeholder="e.g. ST-02"
                  required
                  value={formData.station_code}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Stasiun</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Stasiun IPB"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mac_address">MAC Address Modul (ESP32)</Label>
                <Input
                  id="mac_address"
                  name="mac_address"
                  placeholder="e.g. A1:B2:C3:D4:E5:F6"
                  required
                  value={formData.mac_address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Bogor, Indonesia"
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_password">Password Akses Dasbor</Label>
                <Input
                  id="access_password"
                  name="access_password"
                  type="password"
                  placeholder="Password untuk mengunci halaman detail stasiun"
                  required
                  value={formData.access_password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end pt-4 border-t border-border mt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Daftarkan Stasiun"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
