import { eq, ne } from "drizzle-orm";
import { db } from "../../../db";
import { kkl_periodes } from "../../../db/schema";
import {
  CreateKklPeriodeRequestDto,
  UpdateKklPeriodeRequestDto,
} from "../dto/kkl-periode-request.dto";

export class KklPeriodeWriteRepository {
  static async createKklPeriode(data: CreateKklPeriodeRequestDto) {
    try {
      if (!data.is_active) {
        return await db.insert(kkl_periodes).values({
          ...data,
          is_active: false,
        });
      }

      return await db.transaction(async (tx) => {
        await tx.update(kkl_periodes).set({
          is_active: false,
          updated_at: new Date(),
        });

        return tx.insert(kkl_periodes).values(data);
      });
    } catch (error) {
      throw new Error(`Failed to create kkl periode: ${error}`);
    }
  }

  static async updateKklPeriode(
    id: number,
    data: UpdateKklPeriodeRequestDto,
  ) {
    try {
      if (data.is_active !== true) {
        return await db
          .update(kkl_periodes)
          .set({
            ...data,
            updated_at: new Date(),
          })
          .where(eq(kkl_periodes.id, id));
      }

      return await db.transaction(async (tx) => {
        await tx
          .update(kkl_periodes)
          .set({
            is_active: false,
            updated_at: new Date(),
          })
          .where(ne(kkl_periodes.id, id));

        return tx
          .update(kkl_periodes)
          .set({
            ...data,
            is_active: true,
            updated_at: new Date(),
          })
          .where(eq(kkl_periodes.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to update kkl periode: ${error}`);
    }
  }

  static async activateKklPeriode(id: number) {
    try {
      return await db.transaction(async (tx) => {
        await tx
          .update(kkl_periodes)
          .set({
            is_active: false,
            updated_at: new Date(),
          })
          .where(ne(kkl_periodes.id, id));

        return tx
          .update(kkl_periodes)
          .set({
            is_active: true,
            updated_at: new Date(),
          })
          .where(eq(kkl_periodes.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to activate kkl periode: ${error}`);
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
