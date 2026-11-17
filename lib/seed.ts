import { hashPassword } from "./auth";

export type RoleSeed = { id: number; name: "admin" | "guru" | "siswa"; description: string };
export type SeedUser = { id: number; username: string; passwordHash: string; fullName: string; role: "admin" | "guru" | "siswa"; email: string; status: "active" | "inactive" };

export const rolesSeed: RoleSeed[] = [
  { id: 1, name: "admin", description: "Administrator sistem" },
  { id: 2, name: "guru", description: "Pengajar dan pembuat soal" },
  { id: 3, name: "siswa", description: "Peserta ujian" },
];

export const usersSeed: SeedUser[] = [
  { id: 1, username: "admin", passwordHash: hashPassword("admin123"), fullName: "Admin SMKN 1 Domas", role: "admin", email: "admin@smkn1domas.sch.id", status: "active" },
  { id: 2, username: "guru01", passwordHash: hashPassword("guru123"), fullName: "Bapak Rahmat", role: "guru", email: "guru01@smkn1domas.sch.id", status: "active" },
  { id: 3, username: "siswa01", passwordHash: hashPassword("siswa123"), fullName: "Rina Siswa", role: "siswa", email: "siswa01@smkn1domas.sch.id", status: "active" },
];

export const classesSeed = [
  { id: 1, name: "XI RPL 1", description: "Kelas Rekayasa Perangkat Lunak" },
  { id: 2, name: "XI TKJ 1", description: "Kelas Teknik Komputer Jaringan" },
  { id: 3, name: "XII MPLB 1", description: "Kelas Manajemen Perkantoran" },
];

export const subjectsSeed = [
  { id: 1, name: "Matematika", description: "Pelajaran Matematika" },
  { id: 2, name: "Bahasa Indonesia", description: "Pelajaran Bahasa Indonesia" },
  { id: 3, name: "Produktif", description: "Pelajaran Produktif" },
];

export function findUserByUsername(username: string) {
  return usersSeed.find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function loginWithCredentials(username: string, password: string) {
  const user = findUserByUsername(username);
  if (!user || user.status !== "active" || user.passwordHash !== hashPassword(password)) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function getStats() {
  return {
    totalSiswa: usersSeed.filter((user) => user.role === "siswa").length,
    totalGuru: usersSeed.filter((user) => user.role === "guru").length,
    totalKelas: classesSeed.length,
    totalMapel: subjectsSeed.length,
  };
}
