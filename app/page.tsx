import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/admin", "/guru", "/siswa"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("exam_session")?.value;
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/guru/:path*", "/siswa/:path*"],
};























































