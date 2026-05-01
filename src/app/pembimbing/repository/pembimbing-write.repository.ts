import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { pembimbings } from "../../../db/schema";
import {
  CreatePembimbingRequestDto,
  UpdatePembimbingRequestDto,
} from "../dto/pembimbing-request.dto";

export class PembimbingWriteRepository {
  static async createPembimbing(data: CreatePembimbingRequestDto) {
    try {
      return await db.insert(pembimbings).values(data);
    } catch (error) {
      throw new Error(`Failed to create pembimbing: ${error}`);
    }
  }

  static async updatePembimbing(id: number, data: UpdatePembimbingRequestDto) {
    try {
      return await db
        .update(pembimbings)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(pembimbings.id, id));
    } catch (error) {
      throw new Error(`Failed to update pembimbing: ${error}`);
    }
  }

  static async deletePembimbing(id: number) {
    try {
      return await db.delete(pembimbings).where(eq(pembimbings.id, id));
    } catch (error) {
      throw new Error(`Failed to delete pembimbing: ${error}`);
    }
  }
}
