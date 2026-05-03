import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { dosens } from "../../../db/schema";
import {
  CreateDosenRequestDto,
  UpdateDosenRequestDto,
} from "../dto/dosen-request.dto";

export class DosenWriteRepository {
  static async createDosen(data: CreateDosenRequestDto) {
    try {
      return await db.insert(dosens).values(data);
    } catch (error) {
      throw new Error(`Failed to create dosen: ${error}`);
    }
  }

  static async updateDosen(id: number, data: UpdateDosenRequestDto) {
    try {
      return await db
        .update(dosens)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dosens.id, id));
    } catch (error) {
      throw new Error(`Failed to update dosen: ${error}`);
    }
  }

  static async deleteDosen(id: number) {
    try {
      return await db.delete(dosens).where(eq(dosens.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dosen: ${error}`);
    }
  }
}
