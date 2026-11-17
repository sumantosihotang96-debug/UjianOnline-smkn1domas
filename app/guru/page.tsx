import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";
import { classesSeed, rolesSeed, subjectsSeed, usersSeed } from "@/lib/seed";

export default function AdminPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const stats = [
    { label: "Jumlah siswa", value: usersSeed.filter((user) => user.role === "siswa").length },
    { label: "Jumlah guru", value: usersSeed.filter((user) => user.role === "guru").length },
    { label: "Jumlah kelas", value: classesSeed.length },
    { label: "Mata pelajaran", value: subjectsSeed.length },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Dashboard Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Selamat datang, {session.fullName}</h1>
          </div>

          <form action="/api/logout" method="POST">
            <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-700">
              Keluar
            </button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-sky-400">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Tabel Role</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama Role</th>
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
            <h2 className="text-xl font-semibold">Tabel Pengguna</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usersSeed.map((user) => (
                    <tr key={user.id} className="border-t border-slate-800">
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Tabel Kelas</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama Kelas</th>
                    <th className="px-4 py-3">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {classesSeed.map((kelas) => (
                    <tr key={kelas.id} className="border-t border-slate-800">
                      <td className="px-4 py-3">{kelas.id}</td>
                      <td className="px-4 py-3">{kelas.name}</td>
                      <td className="px-4 py-3 text-slate-300">{kelas.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Tabel Mata Pelajaran</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsSeed.map((subject) => (
                    <tr key={subject.id} className="border-t border-slate-800">
                      <td className="px-4 py-3">{subject.id}</td>
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
    </main>
  );
}










































































































