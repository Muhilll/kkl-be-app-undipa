import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { jurusans } from "../../../db/schema";
import {
  CreateJurusanRequestDto,
  UpdateJurusanRequestDto,
} from "../dto/jurusan-request.dto";

export class JurusanWriteRepository {
  static async createJurusan(data: CreateJurusanRequestDto) {
    try {
      return await db.insert(jurusans).values(data);
    } catch (error) {
      throw new Error(`Failed to create jurusan: ${error}`);
    }
  }

  static async updateJurusan(id: number, data: UpdateJurusanRequestDto) {
    try {
      return await db
        .update(jurusans)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(jurusans.id, id));
    } catch (error) {
      throw new Error(`Failed to update jurusan: ${error}`);
    }
  }

  static async deleteJurusan(id: number) {
    try {
      return await db.delete(jurusans).where(eq(jurusans.id, id));
    } catch (error) {
      throw new Error(`Failed to delete jurusan: ${error}`);
    }
  }
}
