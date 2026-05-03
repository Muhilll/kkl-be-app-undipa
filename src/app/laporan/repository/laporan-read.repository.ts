import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { laporans, kkl_agts, mahasiswas } from "../../../db/schema";

function selectLaporanFields() {
  return {
    id: laporans.id,
    kkl_agt_id: laporans.kkl_agt_id,
    tanggal: laporans.tanggal,
    jam: laporans.jam,
    aktifitas: laporans.aktifitas,
    file: laporans.file,
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
}
