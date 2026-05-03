import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { penilaians } from "../../../db/schema";
import {
  CreatePenilaianRequestDto,
  UpdatePenilaianRequestDto,
} from "../dto/penilaian-request.dto";

export class PenilaianWriteRepository {
  static async createPenilaian(data: CreatePenilaianRequestDto) {
    try {
      return await db.insert(penilaians).values(data);
    } catch (error) {
      throw new Error(`Failed to create penilaian: ${error}`);
    }
  }

  static async updatePenilaian(id: number, data: UpdatePenilaianRequestDto) {
    try {
      return await db
        .update(penilaians)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(penilaians.id, id));
    } catch (error) {
      throw new Error(`Failed to update penilaian: ${error}`);
    }
  }

  static async deletePenilaian(id: number) {
    try {
      return await db.delete(penilaians).where(eq(penilaians.id, id));
    } catch (error) {
      throw new Error(`Failed to delete penilaian: ${error}`);
    }
  }
}
