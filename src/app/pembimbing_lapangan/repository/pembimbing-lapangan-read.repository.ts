import { eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { pembimbings } from "../../../db/schema";

const pembimbingSelect = {
  id: pembimbings.id,
  kkl_klp_id: pembimbings.kkl_klp_id,
  virtual_account: pembimbings.virtual_account,
  nama: pembimbings.nama,
  jabatan: pembimbings.jabatan,
  user_id: pembimbings.user_id,
  created_at: pembimbings.created_at,
  updated_at: pembimbings.updated_at,
};

export class PembimbingLapanganReadRepository {
  static async getAllPembimbings() {
    try {
      return await db.select(pembimbingSelect).from(pembimbings);
    } catch (error) {
      throw new Error(`Failed to fetch pembimbings: ${error}`);
    }
  }

  static async getPembimbingById(id: number) {
    try {
      const result = await db
        .select(pembimbingSelect)
        .from(pembimbings)
        .where(eq(pembimbings.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pembimbing: ${error}`);
    }
  }

  static async getPembimbingByUniqueFields(
    virtual_account: string,
  ) {
    try {
      const result = await db
        .select(pembimbingSelect)
        .from(pembimbings)
        .where(
          eq(pembimbings.virtual_account, virtual_account),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pembimbing: ${error}`);
    }
  }

  static async getPembimbingByKlpId(kkl_klp_id: number) {
    try {
      const result = await db
        .select(pembimbingSelect)
        .from(pembimbings)
        .where(eq(pembimbings.kkl_klp_id, kkl_klp_id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pembimbing by klp id: ${error}`);
    }
  }
}
