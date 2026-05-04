import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_periodes } from "../../../db/schema";
import { Semester } from "../contract/kkl-periode.contract";

export class KklPeriodeReadRepository {
  static async getAllKklPeriodes() {
    try {
      return await db.select().from(kkl_periodes);
    } catch (error) {
      throw new Error(`Failed to fetch kkl periodes: ${error}`);
    }
  }

  static async getKklPeriodeById(id: number) {
    try {
      const result = await db
        .select()
        .from(kkl_periodes)
        .where(eq(kkl_periodes.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl periode: ${error}`);
    }
  }

  static async getKklPeriodeByTahunAndSemester(
    tahun: string,
    semester: Semester,
  ) {
    try {
      const result = await db
        .select()
        .from(kkl_periodes)
        .where(
          and(
            eq(kkl_periodes.tahun, tahun),
            eq(kkl_periodes.semester, semester),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch kkl periode: ${error}`);
    }
  }

  static async getActiveKklPeriodeExcept(id: number) {
    try {
      const result = await db
        .select()
        .from(kkl_periodes)
        .where(
          and(
            eq(kkl_periodes.is_active, true),
            ne(kkl_periodes.id, id),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch active kkl periode: ${error}`);
    }
  }
}
