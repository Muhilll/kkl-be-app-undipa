# Project Structure

## Overview
Aplikasi Backend untuk **Skripsi KKL UNDIPA**. Dibangun dengan **Hono**, berjalan di atas runtime **Bun**, menggunakan **Drizzle ORM** untuk mengakses database **MySQL**. Aplikasi ini bertindak sebagai API server (REST API) yang melayani kebutuhan frontend dan mobile app.

## Tech Stack
- **Framework**: Hono
- **Runtime**: Bun
- **Database**: MySQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT & Custom Header
- **Validation**: Zod (via `@hono/zod-openapi`)
- **Media Storage**: Cloudinary

## Root Files
```text
Skripsi_KKL_UNDIPA_BE/
├── AGENTS.md             # Agent rules & coding conventions
├── STRUCTURE.md          # Project structure docs
├── package.json          # Dependencies & scripts
├── bun.lock              # Bun lockfile
├── drizzle.config.ts     # Drizzle ORM configuration
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment config
├── .env                  # Environment variables
└── src/                  # Source code
```

## Source Code Structure
```text
src/
├── index.ts              # Entry point Hono server
├── app/                  # Domain/Feature modules
│   ├── dosen/            # Modul pengelolaan Dosen
│   ├── instansi/         # Modul pengelolaan Instansi tempat KKL
│   ├── jurusan/          # Modul Fakultas/Jurusan
│   ├── kkl_agt/          # Modul Anggota KKL
│   ├── kkl_klp/          # Modul Kelompok KKL
│   ├── kkl_periode/      # Modul Periode KKL
│   ├── laporan/          # Modul Laporan KKL
│   ├── mahasiswa/        # Modul data Mahasiswa
│   ├── menu/             # Modul navigasi RBAC
│   ├── pembimbing_lapangan/ # Modul pembimbing di lokasi
│   ├── penilaian/        # Modul rekap penilaian
│   ├── position/         # Modul jabatan
│   ├── role/             # Modul Role RBAC
│   ├── role_permission/  # Modul Hak Akses
│   ├── upload/           # Endpoint helper untuk upload file
│   ├── user/             # Modul internal sistem User
│   └── user_api/         # Modul user profile/auth
├── db/                   # Database setup
│   ├── migrate.ts        # Migration execution script
│   ├── schema.ts         # Drizzle Schema definition
│   └── seed.ts           # Seeder untuk data awal
├── docs/                 # OpenAPI configuration & setup
├── middleware/           # Hono middlewares (Auth, Logger, dll)
└── utils/                # Global helper functions
```
