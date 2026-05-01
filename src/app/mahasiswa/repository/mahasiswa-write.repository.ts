import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { mahasiswas } from "../../../db/schema";
import {
  CreateMahasiswaRequestDto,
  UpdateMahasiswaRequestDto,
} from "../dto/mahasiswa-request.dto";

export class MahasiswaWriteRepository {
  static async createMahasiswa(data: CreateMahasiswaRequestDto) {
    try {
      return await db.insert(mahasiswas).values(data);
    } catch (error) {
      throw new Error(`Failed to create mahasiswa: ${error}`);
    }
  }

  static async updateMahasiswa(id: number, data: UpdateMahasiswaRequestDto) {
    try {
      return await db
        .update(mahasiswas)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(mahasiswas.id, id));
    } catch (error) {
      throw new Error(`Failed to update mahasiswa: ${error}`);
    }
  }

  static async deleteMahasiswa(id: number) {
    try {
      return await db.delete(mahasiswas).where(eq(mahasiswas.id, id));
    } catch (error) {
      throw new Error(`Failed to delete mahasiswa: ${error}`);
    }
  }
}
