import { eq, desc, and } from "drizzle-orm";
import { db } from "../../../db";
import { laporans, kkl_agts, mahasiswas, kkl_klps, kkl_periodes } from "../../../db/schema";

function selectLaporanFields() {
  return {
    id: laporans.id,
    kkl_agt_id: laporans.kkl_agt_id,
    tanggal: laporans.tanggal,
    jam: laporans.jam,
    aktifitas: laporans.aktifitas,
    file: laporans.file,
    file_public_id: laporans.file_public_id,
    latitude: laporans.latitude,
    longitude: laporans.longitude,
    jarak: laporans.jarak,
    status: laporans.status,
    created_at: laporans.created_at,
    updated_at: laporans.updated_at,
    mhs_id: mahasiswas.id,
    mhs_nama: mahasiswas.nama,
    mhs_nim: mahasiswas.nim,
  };
}

function laporanJoins(query: any) {
  return query
    .leftJoin(kkl_agts, eq(laporans.kkl_agt_id, kkl_agts.id))
    .leftJoin(mahasiswas, eq(kkl_agts.mahasiswa_id, mahasiswas.id));
}

function mapLaporanRow(row: any) {
  return {
    id: row.id,
    kkl_agt_id: row.kkl_agt_id,
    tanggal: row.tanggal,
    jam: row.jam,
    aktifitas: row.aktifitas,
    file: row.file,
    file_public_id: row.file_public_id,
    latitude: row.latitude,
    longitude: row.longitude,
    jarak: row.jarak,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    mahasiswa: row.mhs_id ? { id: row.mhs_id, nama: row.mhs_nama, nim: row.mhs_nim } : null,
  };
}

export class LaporanReadRepository {
  static async getAllLaporans() {
    try {
      const rows = await laporanJoins(
        db.select(selectLaporanFields()).from(laporans)
      );
      return rows.map(mapLaporanRow);
    } catch (error) {
      throw new Error(`Failed to fetch laporans: ${error}`);
    }
  }

  static async getLaporanById(id: number) {
    try {
      const rows = await laporanJoins(
        db.select(selectLaporanFields()).from(laporans)
      ).where(eq(laporans.id, id)).limit(1);

      return rows[0] ? mapLaporanRow(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch laporan: ${error}`);
    }
  }

  static async getLaporansByMahasiswaId(mahasiswaId: number) {
    try {
      const rows = await laporanJoins(
        db.select(selectLaporanFields()).from(laporans)
      )
      .where(eq(kkl_agts.mahasiswa_id, mahasiswaId))
      .orderBy(desc(laporans.tanggal), desc(laporans.created_at));

      return rows.map(mapLaporanRow);
    } catch (error) {
      throw new Error(`Failed to fetch laporans by mahasiswa: ${error}`);
    }
  }

  static async checkTodayLaporanByMahasiswaId(mahasiswaId: number) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const rows = await laporanJoins(
        db.select(selectLaporanFields()).from(laporans)
      )
      .where(
        and(
          eq(kkl_agts.mahasiswa_id, mahasiswaId),
          eq(laporans.tanggal, today as any)
        )
      ).limit(1);

      return rows.length > 0;
    } catch (error) {
      throw new Error(`Failed to check today laporan by mahasiswa: ${error}`);
    }
  }

  static async checkKklAgtIsActive(kklAgtId: number): Promise<boolean> {
    try {
      const rows = await db
        .select({
          is_active: kkl_periodes.is_active,
        })
        .from(kkl_agts)
        .leftJoin(kkl_klps, eq(kkl_agts.kkl_klp_id, kkl_klps.id))
        .leftJoin(kkl_periodes, eq(kkl_klps.kkl_periode_id, kkl_periodes.id))
        .where(eq(kkl_agts.id, kklAgtId))
        .limit(1);

      if (rows.length === 0) {
        return false;
      }

      return rows[0].is_active ?? false;
    } catch (error) {
      throw new Error(`Failed to check kkl_agt active status: ${error}`);
    }
  }
}