import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { readSessionCookie } from "@/lib/auth";
import { db } from "@/lib/turso";
import { exams, subjects } from "@/lib/schema";

function isAdmin() { return readSessionCookie(cookies().get("exam_session")?.value)?.role === "admin"; }
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!db) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  try {
    const rows = await db.select({ id: exams.id, title: exams.title, subjectId: exams.subjectId, subjectName: subjects.name, durationMinutes: exams.durationMinutes, status: exams.status, token: exams.token, startTime: exams.startTime, endTime: exams.endTime }).from(exams).leftJoin(subjects, eq(exams.subjectId, subjects.id));
    return NextResponse.json(rows);
  } catch (error) { console.error("exam list failed", error); return NextResponse.json({ message: "Gagal membaca ujian. Pastikan migrasi sudah dijalankan." }, { status: 500 }); }
}
export async function POST(request: Request) {
  if (!isAdmin()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!db) return NextResponse.json({ message: "Database belum dikonfigurasi." }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Data tidak valid." }, { status: 400 }); }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const subjectId = Number(body.subjectId);
  const durationMinutes = Number(body.durationMinutes);
  if (title.length < 3 || title.length > 200) return NextResponse.json({ message: "Judul harus 3–200 karakter." }, { status: 400 });
  if (!Number.isSafeInteger(subjectId) || subjectId < 1) return NextResponse.json({ message: "Pilih mata pelajaran yang valid." }, { status: 400 });
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 600) return NextResponse.json({ message: "Durasi harus antara 1 dan 600 menit." }, { status: 400 });
  try {
    const subject = await db.select({ id: subjects.id }).from(subjects).where(eq(subjects.id, subjectId)).limit(1);
    if (!subject[0]) return NextResponse.json({ message: "Mata pelajaran tidak ditemukan." }, { status: 400 });
    const token = randomBytes(4).toString("hex").toUpperCase();
    const created = await db.insert(exams).values({ title, subjectId, durationMinutes, token, status: "draft" }).returning({ id: exams.id, title: exams.title, subjectId: exams.subjectId, durationMinutes: exams.durationMinutes, token: exams.token, status: exams.status });
    return NextResponse.json(created[0], { status: 201 });
  } catch (error) { console.error("exam create failed", error); return NextResponse.json({ message: "Gagal membuat ujian. Pastikan migrasi sudah dijalankan." }, { status: 500 }); }
}
