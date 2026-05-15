import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pemantauan Stasiun Cuaca - Platform IoT",
  description:
    "Platform pemantauan stasiun cuaca berbasis IoT. Visualisasi data lingkungan secara real-time, manajemen stasiun, dan analitik historis.",
  keywords: [
    "stasiun cuaca",
    "IoT",
    "pemantauan",
    "suhu",
    "kelembaban",
    "data lingkungan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
