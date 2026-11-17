export default function HomePage() {
  const isDatabaseConfigured = Boolean(
    process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN,
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="inline-flex w-fit items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
          Ready for setup
        </div>

        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ujian Online SMKN 1 Domas
          </h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Platform ujian online yang siap dikembangkan untuk admin, guru, dan siswa dengan
            integrasi database Turso, import Excel, token ujian, pelanggaran, dan dashboard hasil.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Status database</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-400">
              {isDatabaseConfigured ? "Tersiap" : "Belum diisi"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Role utama</p>
            <p className="mt-3 text-2xl font-semibold text-sky-400">Admin / Guru / Siswa</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">Stack</p>
            <p className="mt-3 text-2xl font-semibold text-violet-400">Next.js + Turso</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Langkah selanjutnya</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>1. Isi variabel environment `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` di file `.env.local`.</li>
            <li>2. Jalankan `npm install`.</li>
            <li>3. Jalankan `npm run dev` untuk mulai aplikasi.</li>
            <li>4. Lanjutkan ke pembuatan schema database, autentikasi, dan modul ujian.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
