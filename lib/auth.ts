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
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function sessionSecret() {
  return process.env.AUTH_SECRET || "local-development-only-change-this-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function serializeUserForCookie(user: AppUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionCookie(value?: string): AppUser | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) return null;
    if (!["admin", "guru", "siswa"].includes(parsed.role)) return null;
    return { id: parsed.id, username: parsed.username, fullName: parsed.fullName, role: parsed.role, email: parsed.email, status: parsed.status } as AppUser;
  } catch {
    return null;
  }
}
