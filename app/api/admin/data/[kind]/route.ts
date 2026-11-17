import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { readSessionCookie } from "@/lib/auth";
import { db } from "@/lib/turso";
import { classes, subjects, students, teachers } from "@/lib/schema";

type Kind = "siswa" | "guru" | "kelas" | "mata-pelajaran";
const allowed = (kind: string): kind is Kind => ["siswa", "guru", "kelas", "mata-pelajaran"].includes(kind);
function authorize() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);
  return session?.role === "admin";
}
function unavailable() {
  return NextResponse.json({ message: "Database belum terhubung. Periksa TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN." }, { status: 503 });
}

export async function GET(_request: Request, context: { params: { kind: string } }) {
  if (!authorize()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!allowed(context.params.kind)) return NextResponse.json({ message: "Jenis data tidak dikenal." }, { status: 404 });
  if (!db) return unavailable();
  try {
    switch (context.params.kind) {
      case "kelas": return NextResponse.json(await db.select().from(classes));
      case "mata-pelajaran": return NextResponse.json(await db.select().from(subjects));
      case "siswa": {
        const rows = await db.select({ id: students.id, nisn: students.nisn, name: students.fullName, classId: students.classId, className: classes.name }).from(students).leftJoin(classes, eq(students.classId, classes.id));
        return NextResponse.json(rows);
      }
      case "guru": return NextResponse.json(await db.select({ id: teachers.id, nip: teachers.nip, name: teachers.fullName }).from(teachers));
    }
  } catch (error) {
    console.error("admin data GET failed", error);
    return NextResponse.json({ message: "Gagal membaca data." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: { kind: string } }) {
  if (!authorize()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!allowed(context.params.kind)) return NextResponse.json({ message: "Jenis data tidak dikenal." }, { status: 404 });
  if (!db) return unavailable();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Data tidak valid." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : null;
  try {
    switch (context.params.kind) {
      case "kelas":
        if (!name) return NextResponse.json({ message: "Nama kelas wajib diisi." }, { status: 400 });
        return NextResponse.json((await db.insert(classes).values({ name, description }).returning())[0], { status: 201 });
      case "mata-pelajaran":
        if (!name) return NextResponse.json({ message: "Nama mata pelajaran wajib diisi." }, { status: 400 });
        return NextResponse.json((await db.insert(subjects).values({ name, description }).returning())[0], { status: 201 });
      case "siswa": {
        const nisn = typeof body.nisn === "string" ? body.nisn.trim() : "";
        const fullName = typeof body.name === "string" ? body.name.trim() : "";
        if (!nisn || !fullName) return NextResponse.json({ message: "NISN dan nama wajib diisi." }, { status: 400 });
        let classId: number | null = null;
        const className = typeof body.className === "string" ? body.className.trim() : "";
        if (className) {
          const found = await db.select({ id: classes.id }).from(classes).where(eq(classes.name, className)).limit(1);
          if (!found[0]) return NextResponse.json({ message: "Kelas tidak ditemukan. Buat kelas terlebih dahulu." }, { status: 400 });
          classId = found[0].id;
        }
        return NextResponse.json((await db.insert(students).values({ nisn, fullName, classId }).returning())[0], { status: 201 });
      }
      case "guru": {
        const nip = typeof body.nip === "string" ? body.nip.trim() : "";
        const fullName = typeof body.name === "string" ? body.name.trim() : "";
        if (!nip || !fullName) return NextResponse.json({ message: "NIP dan nama wajib diisi." }, { status: 400 });
        return NextResponse.json((await db.insert(teachers).values({ nip, fullName }).returning())[0], { status: 201 });
      }
    }
  } catch (error) {
    console.error("admin data POST failed", error);
    return NextResponse.json({ message: "Gagal menyimpan data. Pastikan data unik dan migrasi database sudah dijalankan." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: { kind: string } }) {
  if (!authorize()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!allowed(context.params.kind)) return NextResponse.json({ message: "Jenis data tidak dikenal." }, { status: 404 });
  if (!db) return unavailable();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Data tidak valid." }, { status: 400 }); }
  const id = Number(body.id);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  try {
    let result;
    switch (context.params.kind) {
      case "kelas":
        if (typeof body.name !== "string" || !body.name.trim()) return NextResponse.json({ message: "Nama kelas wajib diisi." }, { status: 400 });
        result = await db.update(classes).set({ name: body.name.trim(), description: typeof body.description === "string" ? body.description.trim() : null }).where(eq(classes.id, id)).returning(); break;
      case "mata-pelajaran":
        if (typeof body.name !== "string" || !body.name.trim()) return NextResponse.json({ message: "Nama mata pelajaran wajib diisi." }, { status: 400 });
        result = await db.update(subjects).set({ name: body.name.trim(), description: typeof body.description === "string" ? body.description.trim() : null }).where(eq(subjects.id, id)).returning(); break;
      case "siswa": {
        const nisn = typeof body.nisn === "string" ? body.nisn.trim() : "";
        const fullName = typeof body.name === "string" ? body.name.trim() : "";
        if (!nisn || !fullName) return NextResponse.json({ message: "NISN dan nama wajib diisi." }, { status: 400 });
        let classId: number | null = null;
        const className = typeof body.className === "string" ? body.className.trim() : "";
        if (className) {
          const found = await db.select({ id: classes.id }).from(classes).where(eq(classes.name, className)).limit(1);
          if (!found[0]) return NextResponse.json({ message: "Kelas tidak ditemukan." }, { status: 400 });
          classId = found[0].id;
        }
        result = await db.update(students).set({ nisn, fullName, classId }).where(eq(students.id, id)).returning(); break;
      }
      case "guru": {
        const nip = typeof body.nip === "string" ? body.nip.trim() : "";
        const fullName = typeof body.name === "string" ? body.name.trim() : "";
        if (!nip || !fullName) return NextResponse.json({ message: "NIP dan nama wajib diisi." }, { status: 400 });
        result = await db.update(teachers).set({ nip, fullName }).where(eq(teachers.id, id)).returning(); break;
      }
    }
    return result?.length ? NextResponse.json(result[0]) : NextResponse.json({ message: "Data tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("admin data PATCH failed", error);
    return NextResponse.json({ message: "Gagal mengubah data. Periksa duplikasi dan relasi data." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { kind: string } }) {
  if (!authorize()) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  if (!allowed(context.params.kind)) return NextResponse.json({ message: "Jenis data tidak dikenal." }, { status: 404 });
  if (!db) return unavailable();
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  try {
    switch (context.params.kind) {
      case "kelas": await db.delete(classes).where(eq(classes.id, id)); break;
      case "mata-pelajaran": await db.delete(subjects).where(eq(subjects.id, id)); break;
      case "siswa": await db.delete(students).where(eq(students.id, id)); break;
      case "guru": await db.delete(teachers).where(eq(teachers.id, id)); break;
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin data DELETE failed", error);
    return NextResponse.json({ message: "Data tidak bisa dihapus karena masih digunakan oleh data lain." }, { status: 409 });
  }
}
