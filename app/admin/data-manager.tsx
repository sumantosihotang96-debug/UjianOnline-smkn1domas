"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Kind = "siswa" | "guru" | "kelas" | "mata-pelajaran";
type Row = { id: number; [key: string]: string | number };
const STORE_KEY = "ujian-online-admin-data-v1";
const definitions: Record<Kind, { title: string; fields: { key: string; label: string; required?: boolean; type?: string }[]; initial: Row[] }> = {
  siswa: { title: "Data Siswa", fields: [{ key: "nisn", label: "NISN", required: true }, { key: "name", label: "Nama lengkap", required: true }, { key: "className", label: "Kelas", required: true }, { key: "username", label: "Username", required: true }, { key: "email", label: "Email", type: "email" }], initial: [{ id: 1, nisn: "00010001", name: "Rina Siswa", className: "XI RPL 1", username: "siswa01", email: "siswa01@smkn1domas.sch.id" }] },
  guru: { title: "Data Guru", fields: [{ key: "nip", label: "NIP", required: true }, { key: "name", label: "Nama lengkap", required: true }, { key: "subject", label: "Mata pelajaran", required: true }, { key: "username", label: "Username", required: true }, { key: "email", label: "Email", type: "email" }], initial: [{ id: 1, nip: "1980000001", name: "Bapak Rahmat", subject: "Matematika", username: "guru01", email: "guru01@smkn1domas.sch.id" }] },
  kelas: { title: "Data Kelas", fields: [{ key: "name", label: "Nama kelas", required: true }, { key: "description", label: "Deskripsi" }], initial: [{ id: 1, name: "XI RPL 1", description: "Kelas Rekayasa Perangkat Lunak" }, { id: 2, name: "XI TKJ 1", description: "Kelas Teknik Komputer Jaringan" }] },
  "mata-pelajaran": { title: "Data Mata Pelajaran", fields: [{ key: "name", label: "Nama mata pelajaran", required: true }, { key: "description", label: "Deskripsi" }], initial: [{ id: 1, name: "Matematika", description: "Pelajaran Matematika" }, { id: 2, name: "Bahasa Indonesia", description: "Pelajaran Bahasa Indonesia" }] },
};

export default function DataManager({ kind }: { kind: Kind }) {
  const definition = definitions[kind];
  const [rows, setRows] = useState<Row[]>([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      const all = saved ? JSON.parse(saved) as Partial<Record<Kind, Row[]>> : {};
      setRows(all[kind] ?? definition.initial);
    } catch {
      setRows(definition.initial);
    }
    setReady(true);
  }, [kind, definition.initial]);

  useEffect(() => {
    if (!ready) return;
    try {
      const saved = localStorage.getItem(STORE_KEY);
      const all = saved ? JSON.parse(saved) as Partial<Record<Kind, Row[]>> : {};
      all[kind] = rows;
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch {
      setMessage("Tidak dapat menyimpan data di browser ini.");
    }
  }, [kind, ready, rows]);

  const filtered = useMemo(() => rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))), [rows, query]);

  function startCreate() {
    setEditing(null);
    setForm(Object.fromEntries(definition.fields.map((field) => [field.key, ""])));
    setMessage("");
  }

  function startEdit(row: Row) {
    setEditing(row.id);
    setForm(Object.fromEntries(definition.fields.map((field) => [field.key, String(row[field.key] ?? "")])));
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const duplicateField = kind === "siswa" ? "nisn" : kind === "guru" ? "nip" : "name";
    if (rows.some((row) => String(row[duplicateField] ?? "").toLowerCase() === String(form[duplicateField] ?? "").trim().toLowerCase() && row.id !== editing)) {
      setMessage(`${definition.fields.find((field) => field.key === duplicateField)?.label} sudah terdaftar.`);
      return;
    }
    if (editing !== null) {
      setRows((current) => current.map((row) => row.id === editing ? { id: editing, ...form } : row));
    } else {
      const id = Math.max(0, ...rows.map((row) => row.id)) + 1;
      setRows((current) => [...current, { id, ...form }]);
    }
    setForm({});
    setEditing(null);
    setMessage("Data berhasil disimpan.");
  }

  function remove(row: Row) {
    if (!window.confirm(`Hapus data ${String(row.name ?? row.username ?? row.id)}?`)) return;
    setRows((current) => current.filter((item) => item.id !== row.id));
    setMessage("Data berhasil dihapus.");
  }

  return <div className="space-y-6"><header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm uppercase tracking-widest text-sky-400">Manajemen sekolah</p><h2 className="mt-2 text-3xl font-bold">{definition.title}</h2><p className="mt-2 text-sm text-slate-400">Tambah, ubah, cari, atau hapus data.</p></div><button onClick={startCreate} className="rounded-xl bg-sky-600 px-4 py-3 font-semibold hover:bg-sky-500">+ Tambah data</button></header>
    {message && <p role="status" className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-sm text-sky-100">{message}</p>}
    {(editing !== null || Object.keys(form).length > 0) && <form onSubmit={save} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">{definition.fields.map((field) => <label key={field.key} className="text-sm text-slate-300">{field.label}<input required={field.required} type={field.type ?? "text"} value={form[field.key] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500" /></label>)}<div className="flex gap-2 sm:col-span-2"><button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold">Simpan</button><button type="button" onClick={() => { setEditing(null); setForm({}); }} className="rounded-lg bg-slate-700 px-4 py-2">Batal</button></div></form>}
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"><div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-400">{ready ? `${filtered.length} data` : "Memuat data..."}</p><input aria-label="Cari data" placeholder="Cari..." value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500" /></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-800 text-slate-200"><tr><th className="px-4 py-3">ID</th>{definition.fields.map((field) => <th key={field.key} className="px-4 py-3">{field.label}</th>)}<th className="px-4 py-3">Aksi</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-slate-800"><td className="px-4 py-3 text-slate-400">{row.id}</td>{definition.fields.map((field) => <td key={field.key} className="px-4 py-3">{String(row[field.key] ?? "—")}</td>)}<td className="whitespace-nowrap px-4 py-3"><button onClick={() => startEdit(row)} className="mr-3 text-sky-400 hover:text-sky-300">Ubah</button><button onClick={() => remove(row)} className="text-red-400 hover:text-red-300">Hapus</button></td></tr>)}{ready && filtered.length === 0 && <tr><td colSpan={definition.fields.length + 2} className="px-4 py-8 text-center text-slate-500">Belum ada data yang cocok.</td></tr>}</tbody></table></div></section><p className="text-xs text-slate-500">Penyimpanan tahap demo: data tersimpan di browser yang sedang digunakan, belum tersinkron ke Turso atau browser lain.</p></div>;
}
