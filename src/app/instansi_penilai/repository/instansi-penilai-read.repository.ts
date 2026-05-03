import { eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { instansi_penilais } from "../../../db/schema";

const instansiPenilaiSelect = {
  id: instansi_penilais.id,
  kkl_klp_id: instansi_penilais.kkl_klp_id,
  virtual_account: instansi_penilais.virtual_account,
  nama: instansi_penilais.nama,
  jabatan: instansi_penilais.jabatan,
  created_at: instansi_penilais.created_at,
  updated_at: instansi_penilais.updated_at,
};

export class InstansiPenilaiReadRepository {
  static async getAllInstansiPenilais() {
    try {
      return await db.select(instansiPenilaiSelect).from(instansi_penilais);
    } catch (error) {
      throw new Error(`Failed to fetch instansi penilais: ${error}`);
    }
  }

  static async getInstansiPenilaiById(id: number) {
    try {
      const result = await db
        .select(instansiPenilaiSelect)
        .from(instansi_penilais)
        .where(eq(instansi_penilais.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch instansi penilai: ${error}`);
    }
  }

  static async getInstansiPenilaiByUniqueFields(
    virtual_account: string,
  ) {
    try {
      const result = await db
        .select(instansiPenilaiSelect)
        .from(instansi_penilais)
        .where(
          eq(instansi_penilais.virtual_account, virtual_account),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch instansi penilai: ${error}`);
    }
  }

  static async getInstansiPenilaiByKlpId(kkl_klp_id: number) {
    try {
      const result = await db
        .select(instansiPenilaiSelect)
        .from(instansi_penilais)
        .where(eq(instansi_penilais.kkl_klp_id, kkl_klp_id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch instansi penilai by klp id: ${error}`);
    }
  }
}
