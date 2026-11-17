import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ujian Online SMKN 1 Domas",
  description: "Platform ujian online untuk sekolah dengan role admin, guru, dan siswa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
