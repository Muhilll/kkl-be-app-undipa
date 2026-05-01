import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_agts } from "../../../db/schema";

export class KklAgtReadRepository {
  static async getAllKklAgts() {
    try {
      return await db.select().from(kkl_agts);
    } catch (error) {
      throw new Error(`Failed to fetch kkl agts: ${error}`);
    }
  }

  static async getKklAgtById(id: number) {
    try {
      const result = await db
        .select()
        .from(kkl_agts)
        .where(eq(kkl_agts.id, id))
        .limit(1);

      return result[0] || null;
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
}
