import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { instansis } from "../../../db/schema";
import {
  CreateInstansiRequestDto,
  UpdateInstansiRequestDto,
} from "../dto/instansi-request.dto";

export class InstansiWriteRepository {
  static async createInstansi(data: CreateInstansiRequestDto) {
    try {
      return await db.insert(instansis).values(data);
    } catch (error) {
      throw new Error(`Failed to create instansi: ${error}`);
    }
  }

  static async updateInstansi(id: number, data: UpdateInstansiRequestDto) {
    try {
      return await db
        .update(instansis)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(instansis.id, id));
    } catch (error) {
      throw new Error(`Failed to update instansi: ${error}`);
    }
  }

  static async deleteInstansi(id: number) {
    try {
      return await db.delete(instansis).where(eq(instansis.id, id));
    } catch (error) {
      throw new Error(`Failed to delete instansi: ${error}`);
    }
  }
}
