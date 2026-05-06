import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_agts, mahasiswas, kkl_klps, kkl_periodes, instansis, dosens } from "../../../db/schema";

function mapAgtRow(row: any) {
  return {
    id: row.id,
    kkl_klp_id: row.kkl_klp_id,
    mahasiswa_id: row.mahasiswa_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    mahasiswa: row.mhs_id ? { id: row.mhs_id, nama: row.mhs_nama, nim: row.mhs_nim } : null,
    kkl_klp: row.klp_id ? {
      id: row.klp_id,
      nama: row.klp_nama,
      kkl_periode: row.periode_id ? { id: row.periode_id, nama: row.periode_nama, tahun: row.periode_tahun, semester: row.periode_semester } : null,
      instansi: row.instansi_id ? { id: row.instansi_id, nama: row.instansi_nama, latitude: row.instansi_lat, longitude: row.instansi_lng, alamat: row.instansi_alamat, telp: row.instansi_telp } : null,
      dosen: row.dosen_id ? { id: row.dosen_id, nidn: row.dosen_nidn, nama: row.dosen_nama } : null,
    } : null,
  };
}

function selectAgtFields() {
  return {
    id: kkl_agts.id,
    kkl_klp_id: kkl_agts.kkl_klp_id,
    mahasiswa_id: kkl_agts.mahasiswa_id,
    created_at: kkl_agts.created_at,
    updated_at: kkl_agts.updated_at,
    mhs_id: mahasiswas.id,
    mhs_nama: mahasiswas.nama,
    mhs_nim: mahasiswas.nim,
    klp_id: kkl_klps.id,
    klp_nama: kkl_klps.nama,
    periode_id: kkl_periodes.id,
    periode_nama: kkl_periodes.nama,
    periode_tahun: kkl_periodes.tahun,
    periode_semester: kkl_periodes.semester,
    instansi_id: instansis.id,
    instansi_nama: instansis.nama,
    instansi_lat: instansis.latitude,
    instansi_lng: instansis.longitude,
    instansi_alamat: instansis.alamat,
    instansi_telp: instansis.telp,
    dosen_id: dosens.id,
    dosen_nidn: dosens.nidn,
    dosen_nama: dosens.nama,
  };
}

function agtJoins(query: any) {
  return query
    .leftJoin(mahasiswas, eq(kkl_agts.mahasiswa_id, mahasiswas.id))
    .leftJoin(kkl_klps, eq(kkl_agts.kkl_klp_id, kkl_klps.id))
    .leftJoin(kkl_periodes, eq(kkl_klps.kkl_periode_id, kkl_periodes.id))
    .leftJoin(instansis, eq(kkl_klps.instansi_id, instansis.id))
    .leftJoin(dosens, eq(kkl_klps.dosen_id, dosens.id));
}

export class KklAgtReadRepository {
  static async getAllKklAgts() {
    try {
      const rows = await agtJoins(
        db.select(selectAgtFields()).from(kkl_agts)
      );
      return rows.map(mapAgtRow);
    } catch (error) {
      throw new Error(`Failed to fetch kkl agts: ${error}`);
    }
  }

  static async getKklAgtsByKlpId(klpId: number) {
    try {
      const rows = await agtJoins(
        db.select(selectAgtFields()).from(kkl_agts)
      ).where(eq(kkl_agts.kkl_klp_id, klpId));
      return rows.map(mapAgtRow);
    } catch (error) {
      throw new Error(`Failed to fetch kkl agts by klp: ${error}`);
    }
  }

  static async getKklAgtById(id: number) {
    try {
      const rows = await agtJoins(
        db.select(selectAgtFields()).from(kkl_agts)
      ).where(eq(kkl_agts.id, id)).limit(1);

      return rows[0] ? mapAgtRow(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl agt: ${error}`);
    }
  }

  static async getKklAgtByGroupAndMahasiswa(
    kklKlpId: number,
    mahasiswaId: number,
  ) {
    try {
      const result = await db
        .select()
        .from(kkl_agts)
        .where(
          and(
            eq(kkl_agts.kkl_klp_id, kklKlpId),
            eq(kkl_agts.mahasiswa_id, mahasiswaId),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl agt: ${error}`);
    }
  }

  static async getKklAgtByMahasiswaId(mahasiswaId: number) {
    try {
      const result = await db
        .select()
        .from(kkl_agts)
        .where(eq(kkl_agts.mahasiswa_id, mahasiswaId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl agt by mahasiswa: ${error}`);
    }
  }

  static async getKklAgtDetailByMahasiswaId(mahasiswaId: number) {
    try {
      const rows = await agtJoins(
        db.select(selectAgtFields()).from(kkl_agts)
      ).where(eq(kkl_agts.mahasiswa_id, mahasiswaId)).limit(1);

      return rows[0] ? mapAgtRow(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl agt detail by mahasiswa: ${error}`);
    }
  }

  static async getKklAgtByMahasiswaAndPeriode(mahasiswaId: number, periodeId: number) {
    try {
      const rows = await agtJoins(
        db.select(selectAgtFields()).from(kkl_agts)
      )
        .where(
          and(
            eq(kkl_agts.mahasiswa_id, mahasiswaId),
            eq(kkl_klps.kkl_periode_id, periodeId)
          )
        )
        .limit(1);

      return rows[0] ? mapAgtRow(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl agt by mahasiswa and periode: ${error}`);
    }
  }
}
