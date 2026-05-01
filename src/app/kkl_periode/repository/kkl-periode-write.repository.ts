import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_periodes } from "../../../db/schema";
import {
  CreateKklPeriodeRequestDto,
  UpdateKklPeriodeRequestDto,
} from "../dto/kkl-periode-request.dto";

export class KklPeriodeWriteRepository {
  static async createKklPeriode(data: CreateKklPeriodeRequestDto) {
    try {
      return await db.insert(kkl_periodes).values(data);
    } catch (error) {
      throw new Error(`Failed to create kkl periode: ${error}`);
    }
  }

  static async updateKklPeriode(
    id: number,
    data: UpdateKklPeriodeRequestDto,
  ) {
    try {
      return await db
        .update(kkl_periodes)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(kkl_periodes.id, id));
    } catch (error) {
      throw new Error(`Failed to update kkl periode: ${error}`);
    }
  }

  static async deleteKklPeriode(id: number) {
    try {
      return await db.delete(kkl_periodes).where(eq(kkl_periodes.id, id));
    } catch (error) {
      throw new Error(`Failed to delete kkl periode: ${error}`);
    }
  }
}
