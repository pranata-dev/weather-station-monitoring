import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stationId, password } = body;

    if (!stationId || !password) {
      return NextResponse.json(
        { success: false, error: "Station ID dan Password wajib diisi." },
        { status: 400 }
      );
    }

    const passwordsEnv = process.env.STATION_PASSWORDS;
    
    if (!passwordsEnv) {
      console.error("STATION_PASSWORDS environment variable is not set.");
      return NextResponse.json(
        { success: false, error: "Konfigurasi server bermasalah." },
        { status: 500 }
      );
    }

    let passwords: Record<string, string>;
    try {
      passwords = JSON.parse(passwordsEnv);
    } catch (e) {
      console.error("Failed to parse STATION_PASSWORDS:", e);
      return NextResponse.json(
        { success: false, error: "Konfigurasi server bermasalah." },
        { status: 500 }
      );
    }

    const correctPassword = passwords[stationId];

    if (!correctPassword) {
      return NextResponse.json(
        { success: false, error: "Station ID tidak terdaftar." },
        { status: 404 }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: "Password salah." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in verify-export:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
