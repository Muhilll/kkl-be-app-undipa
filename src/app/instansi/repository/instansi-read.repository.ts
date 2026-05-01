import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { instansis } from "../../../db/schema";

export class InstansiReadRepository {
  static async getAllInstansis() {
    try {
      return await db.select().from(instansis);
    } catch (error) {
      throw new Error(`Failed to fetch instansis: ${error}`);
    }
  }

  static async getInstansiById(id: number) {
    try {
      const result = await db
        .select()
        .from(instansis)
        .where(eq(instansis.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch instansi: ${error}`);
    }
  }

  static async getInstansiByKode(kode: string) {
    try {
      const result = await db
        .select()
        .from(instansis)
        .where(eq(instansis.kode, kode))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch instansi: ${error}`);
    }
  }
}
