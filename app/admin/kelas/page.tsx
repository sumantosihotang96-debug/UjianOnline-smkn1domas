import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";
import { usersSeed } from "@/lib/seed";

export default function GuruAdminPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const guru = usersSeed.filter((user) => user.role === "guru");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">Data Guru</h1>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {guru.map((item) => (
              <tr key={item.id} className="border-t border-slate-800">
                <td className="px-4 py-3">{item.username}</td>
                <td className="px-4 py-3">{item.fullName}</td>
                <td className="px-4 py-3 text-slate-300">{item.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
