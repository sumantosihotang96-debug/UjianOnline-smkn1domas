# Ujian Online SMKN 1 Domas

Platform ujian online utama yang siap dikembangkan untuk sekolah. Proyek ini menggunakan Next.js, TypeScript, Tailwind CSS, dan Turso (libSQL) untuk data dan schema awal.

## Fitur yang sudah disiapkan

- Next.js app router
- TypeScript
- Tailwind CSS
- Turso + Drizzle ORM
- Template `.env.example`
- Struktur schema awal untuk admin, guru, siswa, kelas, mata pelajaran, ujian, soal, pelanggaran, dan log reset
- Halaman dashboard awal

## Fitur yang akan dikembangkan berikutnya

- Auth role-based (admin, guru, siswa)
- Import Excel untuk siswa dan guru
- CRUD kelas dan mata pelajaran
- Pembuatan ujian dan soal
- Token ujian dan log pelanggaran
- Dashboard live hasil ujian
- Rekap nilai dan pembahasan yang bisa diaktifkan admin
- GPS dan pengaturan ujian aman

## Environment

Buat file `.env.local` dari template di `.env.example` lalu isi nilai Anda.

```bash
cp .env.example .env.local
```

Pastikan tidak menyimpan token ke GitHub. Gunakan `.env.local` dan `.gitignore`.

## Install

```bash
npm install
```

## Run development

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Build

```bash
npm run build
npm run start
```
