import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { jurusans } from "../../../db/schema";

export class JurusanReadRepository {
  static async getAllJurusans() {
    try {
      return await db.select().from(jurusans);
    } catch (error) {
      throw new Error(`Failed to fetch jurusans: ${error}`);
    }
  }

  static async getJurusanById(id: number) {
    try {
      const result = await db
        .select()
        .from(jurusans)
        .where(eq(jurusans.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch jurusan: ${error}`);
    }
  }

  static async getJurusanByKode(kode: string) {
    try {
      const result = await db
        .select()
        .from(jurusans)
        .where(eq(jurusans.kode, kode))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch jurusan: ${error}`);
    }
  }
}
