# Skripsi_KKL_UNDIPA_BE — Agent Rules & Conventions

> Baca file ini SEBELUM menulis kode apa pun di project ini.
> File ini adalah sumber kebenaran untuk semua konvensi, arsitektur, dan pattern yang berlaku di backend.

## 1. Project Identity

| Key              | Value                                            |
| ---------------- | ------------------------------------------------ |
| **Nama**         | Skripsi KKL UNDIPA Backend                       |
| **Stack**        | Hono · Bun · TypeScript                          |
| **Database**     | MySQL via Drizzle ORM                            |
| **Auth**         | JWT (JSON Web Token) + Header `X-App-Token`      |
| **File Upload**  | Cloudinary                                       |
| **Package Mgr**  | Bun                                              |
| **Architecture** | Feature-based modular (controllers, routers, etc)|

## 2. Architecture & Directory Conventions

```text
src/
├── app/          # Feature modules (domain-driven)
├── db/           # Database configuration, schema, seed, migrate
├── docs/         # OpenAPI/Swagger documentation
├── middleware/   # Custom middlewares (auth, dll)
├── utils/        # Global utilities
└── index.ts      # Application entry point
```

**Aturan Penulisan Kode:**
1. **Feature Module**: Setiap fitur baru harus dibuat foldernya sendiri di dalam `src/app/` (misalnya `src/app/kkl_periode`).
2. **Database Schema**: Skema database menggunakan Drizzle ORM dan didefinisikan di `src/db/schema.ts` atau dipisah per modul.
3. **Routing**: Daftarkan route Hono pada index file atau router khusus di dalam setiap modul.
4. **Validation**: Gunakan `zod` melalui `@hono/zod-openapi` untuk validasi request dan response.

## 3. Coding Patterns

- Gunakan ekosistem standar Hono dan Bun API bila memungkinkan untuk performa optimal.
- Pisahkan _business logic_ dari route definition sebisa mungkin.
- Kembalikan format JSON yang konsisten pada API Response (berisi status, message, data).
- Untuk modul yang butuh relasi database yang rumit, manfaatkan fitur Query API dari Drizzle ORM.
- JANGAN menyimpan secret key, token, atau credential di dalam kode secara statis; selalu gunakan environment variables.

## 4. Environment Variables
Variabel yang digunakan secara global:
- `DATABASE_URL` : Koneksi Drizzle ke MySQL
- `PORT` : Port server (Default: 3000)
- `APP_TOKEN` : Custom header untuk autorisasi backend
- `JWT_SECRET` : Secret untuk sign token JSON Web Token
- `ALLOWED_APP_URL` : Konfigurasi CORS
- `CLOUDINARY_URL` / `CLOUDINARY_FOLDER` : Konfigurasi Media Cloudinary
