"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Option = { id?: number; label: string; text: string; isCorrect: boolean };
type Question = { id: number; questionText: string; points: number | null; options: Option[] };
type ExamInfo = { id: number; title: string; status: string | null };

export default function ExamQuestionsPage({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [points, setPoints] = useState("1");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/exams/${params.id}/questions`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal memuat soal.");
    setExam(data.exam);
    setQuestions(data.questions);
  }, [params.id]);
  useEffect(() => { void load().catch((error) => setMessage(error.message)); }, [load]);

  async function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/exams/${params.id}/questions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionText: prompt, points, options: options.map((text, index) => ({ text, isCorrect: index === correctIndex })) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || "Gagal menyimpan soal.");
      setPrompt(""); setOptions(["", "", "", ""]); setCorrectIndex(0); setPoints("1"); setMessage("Soal berhasil disimpan."); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menyimpan soal."); }
    finally { setBusy(false); }
  }
  async function removeQuestion(questionId: number) {
    if (!window.confirm("Hapus soal ini?")) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/exams/${params.id}/questions?questionId=${questionId}`, { method: "DELETE" });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || "Gagal menghapus soal.");
      setMessage("Soal dihapus."); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menghapus soal."); }
    finally { setBusy(false); }
  }

  return <div className="space-y-6"><header className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm uppercase tracking-widest text-sky-400">Kelola soal</p><h1 className="mt-2 text-3xl font-bold">{exam?.title ?? "Memuat ujian..."}</h1><p className="mt-2 text-slate-400">Status: {exam?.status ?? "—"}. Soal bisa diubah hanya saat status draft.</p></header>
    {message && <p role="status" className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-sm text-sky-100">{message}</p>}
    {exam?.status === "draft" && <form onSubmit={addQuestion} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-xl font-semibold">Tambah soal pilihan ganda</h2><label className="block text-sm text-slate-300">Pertanyaan<textarea required maxLength={5000} rows={4} value={prompt} onChange={(event) => setPrompt(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white" /></label><div className="grid gap-3 md:grid-cols-2">{options.map((option, index) => <label key={index} className="text-sm text-slate-300">Pilihan {String.fromCharCode(65 + index)}<input required maxLength={1000} value={option} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label>)}</div><div className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="text-sm text-slate-300">Jawaban benar<select value={correctIndex} onChange={(event) => setCorrectIndex(Number(event.target.value))} className="mt-2 block rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5">{options.map((_, index) => <option key={index} value={index}>Pilihan {String.fromCharCode(65 + index)}</option>)}</select></label><label className="text-sm text-slate-300">Poin<input type="number" min="1" max="100" required value={points} onChange={(event) => setPoints(event.target.value)} className="mt-2 block w-28 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5" /></label><button disabled={busy} className="rounded-lg bg-sky-600 px-4 py-2.5 font-semibold disabled:opacity-50">{busy ? "Menyimpan..." : "Simpan soal"}</button></div></form>}
    <section className="space-y-3">{questions.map((question, index) => <article key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-slate-500">Soal {index + 1} · {question.points ?? 1} poin</p><h2 className="mt-2 whitespace-pre-wrap font-semibold">{question.questionText}</h2></div>{exam?.status === "draft" && <button disabled={busy} onClick={() => void removeQuestion(question.id)} className="text-sm text-red-400">Hapus</button>}</div><ol className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <li key={option.id ?? option.label} className={`rounded-lg border p-3 text-sm ${option.isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : "border-slate-800 text-slate-300"}`}><strong className="mr-2">{option.label}.</strong>{option.text}{option.isCorrect ? " · Jawaban benar" : ""}</li>)}</ol></article>)}{questions.length === 0 && <p className="rounded-xl border border-slate-800 p-6 text-center text-slate-500">Belum ada soal.</p>}</section>
  </div>;
}
