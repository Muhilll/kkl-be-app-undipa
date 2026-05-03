import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_klps, kkl_periodes, instansis, dosens } from "../../../db/schema";

function mapKlpRow(row: any) {
  return {
    id: row.id,
    nama: row.nama,
    kkl_periode_id: row.kkl_periode_id,
    instansi_id: row.instansi_id_fk,
    dosen_id: row.dosen_id_fk,
    created_at: row.created_at,
    updated_at: row.updated_at,
    kkl_periode: row.periode_id ? { id: row.periode_id, nama: row.periode_nama, tahun: row.periode_tahun, semester: row.periode_semester } : null,
    instansi: row.instansi_id ? { id: row.instansi_id, nama: row.instansi_nama } : null,
    dosen: row.dosen_id ? { id: row.dosen_id, nama: row.dosen_nama, nidn: row.dosen_nidn } : null,
  };
}

const kklKlpSelect = {
  id: kkl_klps.id,
  nama: kkl_klps.nama,
  kkl_periode_id: kkl_klps.kkl_periode_id,
  instansi_id_fk: kkl_klps.instansi_id,
  dosen_id_fk: kkl_klps.dosen_id,
  created_at: kkl_klps.created_at,
  updated_at: kkl_klps.updated_at,
  periode_id: kkl_periodes.id,
  periode_nama: kkl_periodes.nama,
  periode_tahun: kkl_periodes.tahun,
  periode_semester: kkl_periodes.semester,
  instansi_id: instansis.id,
  instansi_nama: instansis.nama,
  dosen_id: dosens.id,
  dosen_nama: dosens.nama,
  dosen_nidn: dosens.nidn,
};

function selectKlpFields() {
  return {
    id: kkl_klps.id,
    nama: kkl_klps.nama,
    kkl_periode_id: kkl_klps.kkl_periode_id,
    instansi_id_fk: kkl_klps.instansi_id,
    dosen_id_fk: kkl_klps.dosen_id,
    created_at: kkl_klps.created_at,
    updated_at: kkl_klps.updated_at,
    periode_id: kkl_periodes.id,
    periode_nama: kkl_periodes.nama,
    periode_tahun: kkl_periodes.tahun,
    periode_semester: kkl_periodes.semester,
    instansi_id: instansis.id,
    instansi_nama: instansis.nama,
    dosen_id: dosens.id,
    dosen_nama: dosens.nama,
    dosen_nidn: dosens.nidn,
  };
}

function klpJoins(query: any) {
  return query
    .leftJoin(kkl_periodes, eq(kkl_klps.kkl_periode_id, kkl_periodes.id))
    .leftJoin(instansis, eq(kkl_klps.instansi_id, instansis.id))
    .leftJoin(dosens, eq(kkl_klps.dosen_id, dosens.id));
}

export class KklKlpReadRepository {
  static async getAllKklKlps() {
    try {
      const rows = await klpJoins(
        db.select(selectKlpFields()).from(kkl_klps)
      );
      return rows.map(mapKlpRow);
    } catch (error) {
      throw new Error(`Failed to fetch kkl klps: ${error}`);
    }
  }

  static async getKklKlpById(id: number) {
    try {
      const rows = await klpJoins(
        db.select(selectKlpFields()).from(kkl_klps)
      ).where(eq(kkl_klps.id, id)).limit(1);

      return rows[0] ? mapKlpRow(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl klp: ${error}`);
    }
  }

  static async getKklKlpByGroupKeys(
    kklPeriodeId: number,
    instansiId: number,
    dosenId: number,
  ) {
    try {
      const result = await db
        .select()
        .from(kkl_klps)
        .where(
          and(
            eq(kkl_klps.kkl_periode_id, kklPeriodeId),
            eq(kkl_klps.instansi_id, instansiId),
            eq(kkl_klps.dosen_id, dosenId),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl klp: ${error}`);
    }
  }

  static async getKklKlpByDosenId(dosenId: number) {
    try {
      const result = await db
        .select()
        .from(kkl_klps)
        .where(eq(kkl_klps.dosen_id, dosenId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl klp by dosen: ${error}`);
    }
  }
}
