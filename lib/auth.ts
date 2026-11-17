import crypto from "crypto";

export type UserRole = "admin" | "guru" | "siswa";

export type AppUser = {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  status: "active" | "inactive";
};

export const SESSION_COOKIE = "exam_session";

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function createSessionToken(user: AppUser) {
  const payload = JSON.stringify({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    issuedAt: Date.now(),
  });

  return Buffer.from(payload).toString("base64url");
}

export function readSessionCookie(cookieValue?: string) {
  if (!cookieValue) return null;

  try {
    return JSON.parse(Buffer.from(cookieValue, "base64url").toString("utf-8")) as AppUser;
  } catch {
    return null;
  }
}

export function serializeUserForCookie(user: AppUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}
