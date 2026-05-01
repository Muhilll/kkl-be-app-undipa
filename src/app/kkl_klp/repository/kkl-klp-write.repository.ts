import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_klps } from "../../../db/schema";
import {
  CreateKklKlpRequestDto,
  UpdateKklKlpRequestDto,
} from "../dto/kkl-klp-request.dto";

export class KklKlpWriteRepository {
  static async createKklKlp(data: CreateKklKlpRequestDto) {
    try {
      return await db.insert(kkl_klps).values(data);
    } catch (error) {
      throw new Error(`Failed to create kkl klp: ${error}`);
    }
  }

  static async updateKklKlp(id: number, data: UpdateKklKlpRequestDto) {
    try {
      return await db
        .update(kkl_klps)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(kkl_klps.id, id));
    } catch (error) {
      throw new Error(`Failed to update kkl klp: ${error}`);
    }
  }

  static async deleteKklKlp(id: number) {
    try {
      return await db.delete(kkl_klps).where(eq(kkl_klps.id, id));
    } catch (error) {
      throw new Error(`Failed to delete kkl klp: ${error}`);
    }
  }
}
