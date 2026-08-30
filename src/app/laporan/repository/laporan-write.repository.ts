import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { laporans } from "../../../db/schema";
import {
  CreateLaporanRequestDto,
  UpdateLaporanRequestDto,
} from "../dto/laporan-request.dto";

export class LaporanWriteRepository {
  static async createLaporan(data: CreateLaporanRequestDto) {
    try {
      const payload = {
        ...data,
        tanggal: new Date(data.tanggal),
        status: data.status as "valid" | "invalid",
      };
      return await db.insert(laporans).values(payload);
    } catch (error) {
      throw new Error(`Failed to create laporan: ${error}`);
    }
  }

  static async updateLaporan(id: number, data: UpdateLaporanRequestDto) {
    try {
      return await db
        .update(laporans)
        .set({
          ...data,
          tanggal: data.tanggal ? new Date(data.tanggal) : undefined,
          updated_at: new Date(),
        })
        .where(eq(laporans.id, id));
    } catch (error) {
      throw new Error(`Failed to update laporan: ${error}`);
    }
  }

  static async deleteLaporan(id: number) {
    try {
      return await db.delete(laporans).where(eq(laporans.id, id));
    } catch (error) {
      throw new Error(`Failed to delete laporan: ${error}`);
    }
  }
}
