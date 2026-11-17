import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionCookie } from "@/lib/auth";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/siswa", "Siswa"],
  ["/admin/guru", "Guru"],
  ["/admin/kelas", "Kelas"],
  ["/admin/mata-pelajaran", "Mata Pelajaran"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = readSessionCookie(cookies().get("exam_session")?.value);
  if (!session || session.role !== "admin") redirect("/login");
  return <div className="min-h-screen bg-slate-950 text-slate-50"><aside className="border-b border-slate-800 bg-slate-900 p-4 md:fixed md:inset-y-0 md:w-64 md:border-b-0 md:border-r md:p-6"><p className="text-xs uppercase tracking-[.2em] text-sky-400">SMKN 1 Domas</p><h1 className="mb-5 mt-2 text-2xl font-bold">Admin Panel</h1><nav className="flex flex-wrap gap-2 md:flex-col">{links.map(([href, label]) => <Link className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-sky-500" key={href} href={href}>{label}</Link>)}</nav><form action="/api/logout" method="POST" className="mt-5"><button className="rounded-lg bg-slate-800 px-3 py-2 text-sm">Keluar ({session.username})</button></form></aside><main className="p-4 md:ml-64 md:p-8">{children}</main></div>;
}
