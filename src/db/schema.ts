import {
  int,
  varchar,
  text,
  date,
  time,
  datetime,
  decimal,
  boolean,
  mysqlEnum,
  mysqlTable,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";

export const menus = mysqlTable(
  "menus",
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 100 }).notNull(),
    path: varchar({ length: 255 }),
    permission_path: varchar({ length: 255 }),
    icon: varchar({ length: 255 }),
    parent_id: int(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    parent_fk: foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
    }),
  })
);

// Roles Table
export const roles = mysqlTable("roles", {
  id: int().primaryKey().autoincrement(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Users Table
export const users = mysqlTable(
  "users",
  {
    id: int().primaryKey().autoincrement(),
    username: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role_id: int().notNull(),
    is_active: boolean().default(true).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
  })
);

// Role Permissions Table
export const role_permissions = mysqlTable(
  "role_permissions",
  {
    id: int().primaryKey().autoincrement(),
    role_id: int().notNull(),
    menu_id: int().notNull(),
    can_read: boolean().default(false),
    can_create: boolean().default(false),
    can_update: boolean().default(false),
    can_delete: boolean().default(false),
    can_report: boolean().default(false),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
    menu_fk: foreignKey({
      columns: [table.menu_id],
      foreignColumns: [menus.id],
    }),
  })
);

// Jurusans Table
export const jurusans = mysqlTable("jurusans", {
  id: int().primaryKey().autoincrement(),
  kode: varchar({ length: 50 }).notNull().unique(),
  nama: varchar({ length: 100 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Mahasiswas Table
export const mahasiswas = mysqlTable(
  "mahasiswas",
  {
    id: int().primaryKey().autoincrement(),
    nim: varchar({ length: 50 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull().unique(),
    telp: varchar({ length: 30 }),
    foto: varchar({ length: 255 }),
    image_public_id: varchar({ length: 255 }),
    jurusan_id: int().notNull(),
    user_id: int().notNull().unique(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    jurusan_fk: foreignKey({
      columns: [table.jurusan_id],
      foreignColumns: [jurusans.id],
    }),
    user_fk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
    }),
  })
);

// Dosens Table
export const dosens = mysqlTable(
  "dosens",
  {
    id: int().primaryKey().autoincrement(),
    nidn: varchar({ length: 50 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull().unique(),
    telp: varchar({ length: 30 }),
    foto: varchar({ length: 255 }),
    image_public_id: varchar({ length: 255 }),
    user_id: int().notNull().unique(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    user_fk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
    }),
  })
);

// Instansis Table
export const instansis = mysqlTable("instansis", {
  id: int().primaryKey().autoincrement(),
  kode: varchar({ length: 50 }).notNull().unique(),
  nama: varchar({ length: 150 }).notNull(),
  alamat: text().notNull(),
  telp: varchar({ length: 30 }),
  latitude: decimal({ precision: 10, scale: 8 }),
  longitude: decimal({ precision: 11, scale: 8 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// KKL Periodes Table
export const kkl_periodes = mysqlTable("kkl_periodes", {
  id: int().primaryKey().autoincrement(),
  nama: varchar({ length: 100 }).notNull(),
  tahun: varchar({ length: 9 }).notNull(),
  semester: mysqlEnum(["ganjil", "genap"]).notNull(),
  max_agt_klp: int().notNull(),
  is_active: boolean().default(false).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// KKL Klps Table
export const kkl_klps = mysqlTable(
  "kkl_klps",
  {
    id: int().primaryKey().autoincrement(),
    nama: varchar({ length: 100 }).notNull(),
    kkl_periode_id: int().notNull(),
    instansi_id: int().notNull(),
    dosen_id: int().notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    kkl_periode_fk: foreignKey({
      columns: [table.kkl_periode_id],
      foreignColumns: [kkl_periodes.id],
    }),
    instansi_fk: foreignKey({
      columns: [table.instansi_id],
      foreignColumns: [instansis.id],
    }),
    dosen_fk: foreignKey({
      columns: [table.dosen_id],
      foreignColumns: [dosens.id],
    }),
  })
);

// KKL Agts Table
export const kkl_agts = mysqlTable(
  "kkl_agts",
  {
    id: int().primaryKey().autoincrement(),
    kkl_klp_id: int().notNull(),
    mahasiswa_id: int().notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    kkl_klp_fk: foreignKey({
      columns: [table.kkl_klp_id],
      foreignColumns: [kkl_klps.id],
    }),
    mahasiswa_fk: foreignKey({
      columns: [table.mahasiswa_id],
      foreignColumns: [mahasiswas.id],
    }),
  })
);

// Laporans Table
export const laporans = mysqlTable(
  "laporans",
  {
    id: int().primaryKey().autoincrement(),
    kkl_agt_id: int().notNull(),
    tanggal: date().notNull(),
    jam: varchar({ length: 50 }).notNull(),
    aktifitas: text().notNull(),
    file: varchar({ length: 255 }),
    file_public_id: varchar({ length: 255 }),
    latitude: decimal({ precision: 10, scale: 8 }),
    longitude: decimal({ precision: 11, scale: 8 }),
    jarak: decimal({ precision: 10, scale: 2 }),
    status: mysqlEnum(["valid", "invalid"]).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    kkl_agt_fk: foreignKey({
      columns: [table.kkl_agt_id],
      foreignColumns: [kkl_agts.id],
    }),
  })
);

// Pembimbings Table (Pembimbing Lapangan)
export const pembimbings = mysqlTable(
  "pembimbings",
  {
    id: int().primaryKey().autoincrement(),
    kkl_klp_id: int().notNull(),
    virtual_account: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    jabatan: varchar({ length: 100 }).notNull(),
    user_id: int().notNull().unique(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    kkl_klp_fk: foreignKey({
      columns: [table.kkl_klp_id],
      foreignColumns: [kkl_klps.id],
    }),
    user_fk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
    }),
  })
);

// Penilaians Table
export const penilaians = mysqlTable(
  "penilaians",
  {
    id: int().primaryKey().autoincrement(),
    kkl_agt_id: int().notNull(),
    pembimbing_id: int().notNull(),
    lama_praktek: int().notNull(),
    kehadiran: int().notNull(),
    disiplin: int().notNull(),
    kejujuran: int().notNull(),
    kerajinan: int().notNull(),
    kerja_sama: int().notNull(),
    sikap: int().notNull(),
    inisiatif: int().notNull(),
    tanggung_jawab: int().notNull(),
    komunikasi: int().notNull(),
    kebersihan: int().notNull(),
    penampilan: int().notNull(),
    kecakapan: int().notNull(),
    total: int().notNull(),
    ratarata: decimal({ precision: 5, scale: 2 }).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    kkl_agt_fk: foreignKey({
      columns: [table.kkl_agt_id],
      foreignColumns: [kkl_agts.id],
    }),
    pembimbing_fk: foreignKey({
      columns: [table.pembimbing_id],
      foreignColumns: [pembimbings.id],
    }),
  })
);
