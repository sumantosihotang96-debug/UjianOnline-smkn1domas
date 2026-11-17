import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";

export default function SiswaPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "siswa") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-50">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Dashboard Siswa</p>
            <h1 className="mt-2 text-3xl font-bold">Halo, {session.fullName}</h1>
          </div>

          <form action="/api/logout" method="POST">
            <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-700">
              Keluar
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Ujian tersedia</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">0</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Selesai</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">0</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Nilai rata-rata</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">-</p>
          </div>
        </div>
      </div>
    </main>
  );
}
