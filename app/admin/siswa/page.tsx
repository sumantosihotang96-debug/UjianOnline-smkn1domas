import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";
import { classesSeed, getStats, rolesSeed, subjectsSeed, usersSeed } from "@/lib/seed";

export default function AdminDashboardPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const stats = [
    { label: "Siswa", value: getStats().totalSiswa, tone: "text-sky-400" },
    { label: "Guru", value: getStats().totalGuru, tone: "text-violet-400" },
    { label: "Kelas", value: getStats().totalKelas, tone: "text-emerald-400" },
    { label: "Mapel", value: getStats().totalMapel, tone: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">Selamat datang, {session.fullName}</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`mt-3 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Role</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {rolesSeed.map((role) => (
                  <tr key={role.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{role.id}</td>
                    <td className="px-4 py-3 capitalize">{role.name}</td>
                    <td className="px-4 py-3 text-slate-300">{role.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Pengguna</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {usersSeed.map((user) => (
                  <tr key={user.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Kelas</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {classesSeed.map((kelas) => (
                  <tr key={kelas.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{kelas.name}</td>
                    <td className="px-4 py-3 text-slate-300">{kelas.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Mata Pelajaran</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {subjectsSeed.map((subject) => (
                  <tr key={subject.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{subject.name}</td>
                    <td className="px-4 py-3 text-slate-300">{subject.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
