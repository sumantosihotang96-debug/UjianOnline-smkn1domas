import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { readSessionCookie } from "@/lib/auth";
import { db } from "@/lib/turso";
import { exams, questions, questionOptions } from "@/lib/schema";

function isAdmin() {
  return readSessionCookie(cookies().get("exam_session")?.value)?.role === "admin";
}
function validExamId(value: string) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const examId = validExamId(context.params.id);
  if (!examId) return NextResponse.json({ message: "ID ujian tidak valid." }, { status: 400 });
  if (!db) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  try {
    const exam = await db.select({ id: exams.id, title: exams.title, status: exams.status }).from(exams).where(eq(exams.id, examId)).limit(1);
    if (!exam[0]) return NextResponse.json({ message: "Ujian tidak ditemukan." }, { status: 404 });
    const questionRows = await db.select().from(questions).where(eq(questions.examId, examId)).orderBy(questions.orderIndex);
    const optionRows = questionRows.length ? await db.select().from(questionOptions) : [];
    const forExam = optionRows.filter((option) => questionRows.some((question) => question.id === option.questionId));
    return NextResponse.json({ exam: exam[0], questions: questionRows.map((question) => ({ ...question, options: forExam.filter((option) => option.questionId === question.id) })) });
  } catch (error) {
    console.error("exam questions GET failed", error);
    return NextResponse.json({ message: "Gagal membaca soal. Pastikan migrasi database telah dijalankan." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const examId = validExamId(context.params.id);
  if (!examId) return NextResponse.json({ message: "ID ujian tidak valid." }, { status: 400 });
  if (!db) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 }); }
  const questionText = typeof body.questionText === "string" ? body.questionText.trim() : "";
  const points = Number(body.points ?? 1);
  const options = Array.isArray(body.options) ? body.options : [];
  if (!questionText || questionText.length > 5000) return NextResponse.json({ message: "Isi soal wajib diisi (maksimal 5000 karakter)." }, { status: 400 });
  if (!Number.isSafeInteger(points) || points < 1 || points > 100) return NextResponse.json({ message: "Poin harus antara 1 dan 100." }, { status: 400 });
  if (options.length < 2 || options.length > 6) return NextResponse.json({ message: "Masukkan 2 sampai 6 pilihan jawaban." }, { status: 400 });
  const normalizedOptions = options.map((option, index) => {
    const value = option && typeof option === "object" ? option as Record<string, unknown> : {};
    return { label: String.fromCharCode(65 + index), text: typeof value.text === "string" ? value.text.trim() : "", isCorrect: value.isCorrect === true };
  });
  if (normalizedOptions.some((option) => !option.text || option.text.length > 1000)) return NextResponse.json({ message: "Semua pilihan jawaban wajib diisi (maksimal 1000 karakter)." }, { status: 400 });
  if (normalizedOptions.filter((option) => option.isCorrect).length !== 1) return NextResponse.json({ message: "Pilih tepat satu jawaban yang benar." }, { status: 400 });
  try {
    const exam = await db.select({ id: exams.id, status: exams.status }).from(exams).where(eq(exams.id, examId)).limit(1);
    if (!exam[0]) return NextResponse.json({ message: "Ujian tidak ditemukan." }, { status: 404 });
    if (exam[0].status !== "draft") return NextResponse.json({ message: "Soal hanya bisa diubah saat ujian berstatus draft." }, { status: 409 });
    const existing = await db.select({ id: questions.id }).from(questions).where(eq(questions.examId, examId));
    const inserted = await db.insert(questions).values({ examId, questionText, points, orderIndex: existing.length }).returning({ id: questions.id });
    const questionId = inserted[0].id;
    await db.insert(questionOptions).values(normalizedOptions.map((option) => ({ questionId, ...option })));
    return NextResponse.json({ id: questionId, questionText, points, options: normalizedOptions }, { status: 201 });
  } catch (error) {
    console.error("exam question POST failed", error);
    return NextResponse.json({ message: "Gagal menyimpan soal. Pastikan migrasi database telah dijalankan." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const examId = validExamId(context.params.id);
  const questionId = Number(new URL(request.url).searchParams.get("questionId"));
  if (!examId || !Number.isSafeInteger(questionId) || questionId < 1) return NextResponse.json({ message: "ID ujian atau soal tidak valid." }, { status: 400 });
  if (!db) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  try {
    const exam = await db.select({ status: exams.status }).from(exams).where(eq(exams.id, examId)).limit(1);
    if (!exam[0]) return NextResponse.json({ message: "Ujian tidak ditemukan." }, { status: 404 });
    if (exam[0].status !== "draft") return NextResponse.json({ message: "Soal hanya bisa dihapus saat ujian berstatus draft." }, { status: 409 });
    const found = await db.select({ id: questions.id }).from(questions).where(and(eq(questions.id, questionId), eq(questions.examId, examId))).limit(1);
    if (!found[0]) return NextResponse.json({ message: "Soal tidak ditemukan." }, { status: 404 });
    await db.delete(questionOptions).where(eq(questionOptions.questionId, questionId));
    await db.delete(questions).where(and(eq(questions.id, questionId), eq(questions.examId, examId)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("exam question DELETE failed", error);
    return NextResponse.json({ message: "Gagal menghapus soal." }, { status: 500 });
  }
}
