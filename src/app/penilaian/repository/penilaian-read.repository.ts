import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { penilaians } from "../../../db/schema";

const penilaianSelect = {
  id: penilaians.id,
  kkl_agt_id: penilaians.kkl_agt_id,
  instansi_penilai_id: penilaians.instansi_penilai_id,
  lama_praktek: penilaians.lama_praktek,
  kehadiran: penilaians.kehadiran,
  disiplin: penilaians.disiplin,
  kejujuran: penilaians.kejujuran,
  kerajinan: penilaians.kerajinan,
  kerja_sama: penilaians.kerja_sama,
  sikap: penilaians.sikap,
  inisiatif: penilaians.inisiatif,
  tanggung_jawab: penilaians.tanggung_jawab,
  komunikasi: penilaians.komunikasi,
  kebersihan: penilaians.kebersihan,
  penampilan: penilaians.penampilan,
  kecakapan: penilaians.kecakapan,
  total: penilaians.total,
  ratarata: penilaians.ratarata,
  created_at: penilaians.created_at,
  updated_at: penilaians.updated_at,
};

export class PenilaianReadRepository {
  static async getAllPenilaians() {
    try {
      return await db.select(penilaianSelect).from(penilaians);
    } catch (error) {
      throw new Error(`Failed to fetch penilaians: ${error}`);
    }
  }

  static async getPenilaianById(id: number) {
    try {
      const result = await db
        .select(penilaianSelect)
        .from(penilaians)
        .where(eq(penilaians.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch penilaian: ${error}`);
    }
  }
}
