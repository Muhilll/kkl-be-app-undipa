import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_klps } from "../../../db/schema";

export class KklKlpReadRepository {
  static async getAllKklKlps() {
    try {
      return await db.select().from(kkl_klps);
    } catch (error) {
      throw new Error(`Failed to fetch kkl klps: ${error}`);
    }
  }

  static async getKklKlpById(id: number) {
    try {
      const result = await db
        .select()
        .from(kkl_klps)
        .where(eq(kkl_klps.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl klp: ${error}`);
    }
  }

  static async getKklKlpByGroupKeys(
    kklPeriodeId: number,
    instansiId: number,
    pembimbingId: number,
  ) {
    try {
      const result = await db
        .select()
        .from(kkl_klps)
        .where(
          and(
            eq(kkl_klps.kkl_periode_id, kklPeriodeId),
            eq(kkl_klps.instansi_id, instansiId),
            eq(kkl_klps.pembimbing_id, pembimbingId),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl klp: ${error}`);
    }
  }
}
