import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = readSessionCookie(cookies().get("exam_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/siswa", label: "Siswa" },
    { href: "/admin/guru", label: "Guru" },
    { href: "/admin/kelas", label: "Kelas" },
    { href: "/admin/mata-pelajaran", label: "Mata Pelajaran" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-800 bg-slate-900/90 p-5 backdrop-blur">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-400">SMKN 1 Domas</p>
          <h1 className="mt-2 text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-500 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form action="/api/logout" method="POST" className="mt-8">
          <button className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
            Logout
          </button>
        </form>
      </aside>

      <main className="ml-72 p-6">{children}</main>
    </div>
  );
}
