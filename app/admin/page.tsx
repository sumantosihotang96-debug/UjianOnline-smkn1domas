import Link from "next/link";
import { getStats } from "@/lib/seed";

export default function AdminDashboardPage() {
  const stats = getStats();
  const cards = [["Siswa", stats.totalSiswa, "/admin/siswa"], ["Guru", stats.totalGuru, "/admin/guru"], ["Kelas", stats.totalKelas, "/admin/kelas"], ["Mata pelajaran", stats.totalMapel, "/admin/mata-pelajaran"]] as const;
  return <div className="space-y-6"><header className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm uppercase tracking-widest text-sky-400">Ringkasan</p><h2 className="mt-2 text-3xl font-bold">Dashboard Admin</h2><p className="mt-2 text-slate-400">Kelola data sekolah dan persiapan ujian.</p></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, count, href]) => <Link key={label} href={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-sky-500"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-sky-400">{count}</p><p className="mt-3 text-xs text-slate-500">Buka data →</p></Link>)}</section><p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">Data CRUD yang ditambahkan dari browser saat ini disimpan di penyimpanan lokal browser. Sinkronisasi Turso akan menjadi tahap integrasi berikutnya.</p></div>;
}
