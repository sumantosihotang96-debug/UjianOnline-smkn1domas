import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSessionCookie } from "@/lib/auth";

export default function SiswaPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);
  if (!session || session.role !== "siswa") redirect("/login");
  return <main className="min-h-screen bg-slate-950 p-6 text-white"><div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-8"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-widest text-emerald-400">Dashboard Siswa</p><h1 className="mt-2 text-3xl font-bold">Halo, {session.fullName}</h1></div><form action="/api/logout" method="POST"><button className="rounded-lg bg-slate-800 px-4 py-2">Keluar</button></form></div><p className="mt-8 rounded-xl border border-slate-800 p-5 text-slate-300">Belum ada ujian yang dipublikasikan.</p></div></main>;
}
