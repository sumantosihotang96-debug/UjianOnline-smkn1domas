import Link from "next/link";
import { getStats } from "@/lib/seed";
export default function AdminDashboardPage() {
  const stats = getStats();
  const cards = [["Siswa", stats.totalSiswa, "/admin/siswa"], ["Guru", stats.totalGuru, "/admin/guru"], ["Kelas", stats.totalKelas, "/admin/kelas"], ["Mata pelajaran", stats.totalMapel, "/admin/mata-pelajaran"]] as const;
  return <div className="space-y-6"><header className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm uppercase tracking-widest text-sky-400">Ringkasan</p><h2 className="mt-2 text-3xl font-bold">Dashboard Admin</h2><p className="mt-2 text-slate-400">Kelola data sekolah dan persiapan ujian.</p></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, count, href]) => <Link key={label} href={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-sky-500"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-sky-400">{count}</p><p className="mt-3 text-xs text-slate-500">Buka data →</p></Link>)}</section><Link href="/admin/ujian" className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-sky-500"><h3 className="text-lg font-semibold">Ujian</h3><p className="mt-1 text-sm text-slate-400">Buat ujian, kelola token, dan tambahkan soal.</p></Link></div>;
}
