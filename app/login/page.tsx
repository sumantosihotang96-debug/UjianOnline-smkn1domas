"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) { setError(data.message || "Login gagal."); return; }
      router.replace(data.redirectTo);
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">SMKN 1 Domas</p>
        <h1 className="mt-3 text-center text-3xl font-bold">Masuk Ujian Online</h1>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block text-sm text-slate-300">Username<input required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-white outline-none focus:border-sky-500" /></label>
          <label className="block text-sm text-slate-300">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-white outline-none focus:border-sky-500" /></label>
          {error && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold hover:bg-sky-500 disabled:opacity-60">{busy ? "Memproses..." : "Masuk"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">Akun demo: admin/admin123, guru01/guru123, siswa01/siswa123</p>
      </section>
    </main>
  );
}
