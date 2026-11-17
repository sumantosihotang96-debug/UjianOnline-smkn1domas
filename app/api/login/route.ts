import { NextResponse } from "next/server";
import { loginWithCredentials } from "@/lib/seed";
import { serializeUserForCookie, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: unknown; password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Format permintaan tidak valid." }, { status: 400 }); }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password || username.length > 100 || password.length > 200) return NextResponse.json({ message: "Username dan password wajib diisi." }, { status: 400 });
  const user = loginWithCredentials(username, password);
  if (!user) return NextResponse.json({ message: "Username atau password salah." }, { status: 401 });
  const response = NextResponse.json({ ok: true, redirectTo: user.role === "admin" ? "/admin" : user.role === "guru" ? "/guru" : "/siswa" });
  response.cookies.set(SESSION_COOKIE, serializeUserForCookie(user), { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8 });
  return response;
}
