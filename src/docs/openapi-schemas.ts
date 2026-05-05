import { z } from "@hono/zod-openapi";
import { timestampSchema } from "./openapi-common";

export const roleSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Role");

export const menuSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Dashboard",
    }),
    path: z.string().nullable().openapi({
      example: "/dashboard",
    }),
    permission_path: z.string().nullable().openapi({
      example: null,
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Menu");

export const jurusanSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    kode: z.string().openapi({
      example: "TI",
    }),
    nama: z.string().openapi({
      example: "Teknik Informatika",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Jurusan");

export const mahasiswaSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    nim: z.string().openapi({
      example: "20260001",
    }),
    nama: z.string().openapi({
      example: "Budi Santoso",
    }),
    email: z.string().email().openapi({
      example: "budi@example.com",
    }),
    telp: z.string().nullable().openapi({
      example: "081234567890",
    }),
    foto: z.string().nullable().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
    }),
    image_public_id: z.string().nullable().openapi({
      example: "uploads/foto",
    }),
    jurusan_id: z.number().int().openapi({
      example: 1,
    }),
    user_id: z.number().int().openapi({
      example: 3,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    jurusan: z
      .object({
        kode: z.string().openapi({ example: "TI" }),
        nama: z.string().openapi({ example: "Teknik Informatika" }),
      })
      .nullable()
      .optional()
      .openapi("MahasiswaJurusanSummary"),
  })
  .openapi("Mahasiswa");

export const dosenSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    nidn: z.string().openapi({
      example: "0912345601",
    }),
    nama: z.string().openapi({
      example: "Dr. Andi Wijaya",
    }),
    email: z.string().email().openapi({
      example: "andi@example.com",
    }),
    telp: z.string().nullable().openapi({
      example: "081234567890",
    }),
    foto: z.string().nullable().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/dosen.jpg",
    }),
    image_public_id: z.string().nullable().openapi({
      example: "uploads/dosen",
    }),
    user_id: z.number().int().openapi({
      example: 4,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Dosen");

export const instansiSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    kode: z.string().openapi({
      example: "INS001",
    }),
    nama: z.string().openapi({
      example: "PT Teknologi Nusantara",
    }),
    alamat: z.string().openapi({
      example: "Jl. Perintis Kemerdekaan No. 10, Makassar",
    }),
    telp: z.string().nullable().openapi({
      example: "0411123456",
    }),
    latitude: z.string().nullable().openapi({
      example: "-5.14766500",
    }),
    longitude: z.string().nullable().openapi({
      example: "119.43273200",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Instansi");

export const instansiPenilaiSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    kkl_klp_id: z.number().int().openapi({
      example: 1,
    }),
    virtual_account: z.string().openapi({
      example: "VA123456789",
    }),
    nama: z.string().openapi({
      example: "Bapak Budi",
    }),
    jabatan: z.string().openapi({
      example: "Manager HRD",
    }),
    user_id: z.number().int().openapi({
      example: 5,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("InstansiPenilai");

export const kklPeriodeSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    nama: z.string().openapi({
      example: "KKL 2026 Ganjil",
    }),
    tahun: z.string().openapi({
      example: "2026",
    }),
    semester: z.enum(["ganjil", "genap"]).openapi({
      example: "ganjil",
    }),
    max_agt_klp: z.number().int().openapi({
      example: 5,
    }),
    is_active: z.boolean().openapi({
      example: true,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("KklPeriode");

export const kklKlpSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    nama: z.string().openapi({
      example: "Kelompok 1",
    }),
    kkl_periode_id: z.number().int().openapi({
      example: 1,
    }),
    instansi_id: z.number().int().openapi({
      example: 1,
    }),
    dosen_id: z.number().int().openapi({
      example: 1,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    kkl_periode: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "KKL 2026 Ganjil" }),
        tahun: z.string().openapi({ example: "2026" }),
        semester: z.string().openapi({ example: "ganjil" }),
      })
      .nullable()
      .optional()
      .openapi("KklKlpPeriodeSummary"),
    instansi: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "PT Teknologi Nusantara" }),
      })
      .nullable()
      .optional()
      .openapi("KklKlpInstansiSummary"),
    dosen: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "Dr. Andi Wijaya" }),
        nidn: z.string().openapi({ example: "0912345601" }),
      })
      .nullable()
      .optional()
      .openapi("KklKlpDosenSummary"),
  })
  .openapi("KklKlp");

export const kklAgtSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    kkl_klp_id: z.number().int().openapi({
      example: 1,
    }),
    mahasiswa_id: z.number().int().openapi({
      example: 1,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    mahasiswa: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "Budi Santoso" }),
        nim: z.string().openapi({ example: "20260001" }),
      })
      .nullable()
      .optional()
      .openapi("KklAgtMahasiswaSummary"),
    kkl_klp: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "Kelompok 1" }),
        kkl_periode: z
          .object({
            id: z.number().int().openapi({ example: 1 }),
            nama: z.string().openapi({ example: "KKL 2026 Ganjil" }),
            tahun: z.string().openapi({ example: "2026" }),
            semester: z.string().openapi({ example: "ganjil" }),
          })
          .nullable()
          .optional()
          .openapi("KklAgtKlpPeriodeSummary"),
        instansi: z
          .object({
            id: z.number().int().openapi({ example: 1 }),
            nama: z.string().openapi({ example: "PT Teknologi Nusantara" }),
            latitude: z.string().nullable().openapi({ example: "-5.14766500" }),
            longitude: z.string().nullable().openapi({ example: "119.43273200" }),
          })
          .nullable()
          .optional()
          .openapi("KklAgtKlpInstansiSummary"),
        dosen: z
          .object({
            id: z.number().int().openapi({ example: 1 }),
            nama: z.string().openapi({ example: "Dr. Andi Wijaya" }),
          })
          .nullable()
          .optional()
          .openapi("KklAgtKlpDosenSummary"),
      })
      .nullable()
      .optional()
      .openapi("KklAgtKlpSummary"),
  })
  .openapi("KklAgt");

export const laporanSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    kkl_agt_id: z.number().int().openapi({ example: 1 }),
    tanggal: z.string().openapi({ example: "2026-05-01" }),
    jam: z.string().openapi({ example: "08:00:00" }),
    aktifitas: z.string().openapi({ example: "Kegiatan observasi lapangan" }),
    file: z.string().nullable().openapi({ example: null }),
    latitude: z.string().nullable().openapi({ example: "-5.14766500" }),
    longitude: z.string().nullable().openapi({ example: "119.43273200" }),
    jarak: z.string().nullable().openapi({ example: "0.50" }),
    status: z.enum(["valid", "invalid"]).openapi({ example: "valid" }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    mahasiswa: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        nama: z.string().openapi({ example: "Budi Santoso" }),
        nim: z.string().openapi({ example: "20260001" }),
      })
      .nullable()
      .optional()
      .openapi("LaporanMahasiswaSummary"),
  })
  .openapi("Laporan");

export const penilaianSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    kkl_agt_id: z.number().int().openapi({
      example: 1,
    }),
    instansi_penilai_id: z.number().int().openapi({
      example: 1,
    }),
    lama_praktek: z.number().int().openapi({ example: 85 }),
    kehadiran: z.number().int().openapi({ example: 90 }),
    disiplin: z.number().int().openapi({ example: 85 }),
    kejujuran: z.number().int().openapi({ example: 95 }),
    kerajinan: z.number().int().openapi({ example: 80 }),
    kerja_sama: z.number().int().openapi({ example: 85 }),
    sikap: z.number().int().openapi({ example: 90 }),
    inisiatif: z.number().int().openapi({ example: 80 }),
    tanggung_jawab: z.number().int().openapi({ example: 85 }),
    komunikasi: z.number().int().openapi({ example: 85 }),
    kebersihan: z.number().int().openapi({ example: 90 }),
    penampilan: z.number().int().openapi({ example: 90 }),
    kecakapan: z.number().int().openapi({ example: 85 }),
    total: z.number().int().openapi({ example: 1225 }),
    ratarata: z.string().openapi({ example: "87.50" }), // Decimal mapped to string usually in zod/openapi
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Penilaian");

export const userRoleSummarySchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
  })
  .openapi("UserRoleSummary");

export const userSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    username: z.string().openapi({
      example: "admin",
    }),
    role_id: z.number().int().openapi({
      example: 1,
    }),
    is_active: z.boolean().openapi({
      example: true,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
  })
  .openapi("User");

export const navigationPermissionSchema = z
  .object({
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: false,
    }),
    can_report: z.boolean().openapi({
      example: false,
    }),
  })
  .openapi("NavigationPermission");

export const navigationItemSchema: z.ZodTypeAny = z
  .object({
    id: z.number().int().openapi({
      example: 2,
    }),
    name: z.string().openapi({
      example: "Master Data",
    }),
    path: z.string().nullable().openapi({
      example: "/master-data",
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    permissions: navigationPermissionSchema,
    children: z.array(z.lazy(() => navigationItemSchema)),
  })
  .openapi("NavigationItem");

export const rolePermissionSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    role_id: z.number().int().openapi({
      example: 1,
    }),
    menu_id: z.number().int().openapi({
      example: 2,
    }),
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: true,
    }),
    can_report: z.boolean().openapi({
      example: true,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
    menu: z.object({
      id: z.number().int().openapi({
        example: 2,
      }),
      name: z.string().openapi({
        example: "Master Data",
      }),
      path: z.string().nullable().openapi({
        example: "/master-data",
      }),
      permission_path: z.string().nullable().openapi({
        example: null,
      }),
      icon: z.string().nullable().openapi({
        example: null,
      }),
      parent_id: z.number().int().nullable().openapi({
        example: null,
      }),
    }),
  })
  .openapi("RolePermission");

export const uploadSignatureResponseSchema = z
  .object({
    apiKey: z.string().openapi({
      example: "123456789012345",
    }),
    cloudName: z.string().openapi({
      example: "my-cloud",
    }),
    folder: z.string().openapi({
      example: "uploads",
    }),
    signature: z.string().openapi({
      example: "c1d2e3f4",
    }),
    timestamp: z.number().int().openapi({
      example: 1770000000,
    }),
    uploadUrl: z.string().url().openapi({
      example: "https://api.cloudinary.com/v1_1/my-cloud/image/upload",
    }),
  })
  .openapi("UploadSignatureResponse");
