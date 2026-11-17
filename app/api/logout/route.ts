import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { loginWithCredentials, serializeUserForCookie, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "").trim();

  const user = loginWithCredentials(username, password);

  if (!user) {
    return NextResponse.json(
      { message: "Username atau password salah." },
      { status: 401 },
    );
  }

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, serializeUserForCookie(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true, user });
}
