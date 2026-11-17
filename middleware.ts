import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("exam_session")?.value;
  if (["/admin", "/guru", "/siswa"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/guru/:path*", "/siswa/:path*"] };
