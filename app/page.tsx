import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSessionCookie } from "@/lib/auth";

export default function HomePage() {
  const session = readSessionCookie(cookies().get("exam_session")?.value);
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");
  if (session.role === "guru") redirect("/guru");
  redirect("/siswa");
}
