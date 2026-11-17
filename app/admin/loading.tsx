import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";
import { subjectsSeed } from "@/lib/seed";

export default function MataPelajaranAdminPage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">Data Mata Pelajaran</h1>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
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
  );
}
