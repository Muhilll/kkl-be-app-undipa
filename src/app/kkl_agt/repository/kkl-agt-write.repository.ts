import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_agts } from "../../../db/schema";
import {
  CreateKklAgtRequestDto,
  UpdateKklAgtRequestDto,
} from "../dto/kkl-agt-request.dto";

export class KklAgtWriteRepository {
  static async createKklAgt(data: CreateKklAgtRequestDto) {
    try {
      return await db.insert(kkl_agts).values(data);
    } catch (error) {
      throw new Error(`Failed to create kkl agt: ${error}`);
    }
  }

  static async updateKklAgt(id: number, data: UpdateKklAgtRequestDto) {
    try {
      return await db
        .update(kkl_agts)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(kkl_agts.id, id));
    } catch (error) {
      throw new Error(`Failed to update kkl agt: ${error}`);
    }
  }

  static async deleteKklAgt(id: number) {
    try {
      return await db.delete(kkl_agts).where(eq(kkl_agts.id, id));
    } catch (error) {
      throw new Error(`Failed to delete kkl agt: ${error}`);
    }
  }
}
