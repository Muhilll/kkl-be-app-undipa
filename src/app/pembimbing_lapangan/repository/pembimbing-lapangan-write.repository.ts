import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { pembimbings, users, roles } from "../../../db/schema";
import {
  CreatePembimbingLapanganRequestDto,
  UpdatePembimbingLapanganRequestDto,
} from "../dto/pembimbing-lapangan-request.dto";

export class PembimbingLapanganWriteRepository {
  static async createPembimbing(data: CreatePembimbingLapanganRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        // Find PEMBIMBING_LAPANGAN role, fallback to USER
        let role = await tx.query.roles.findFirst({
          where: eq(roles.code, "PEMBIMBING_LAPANGAN"),
        });

        if (!role) {
          role = await tx.query.roles.findFirst({
            where: eq(roles.code, "INSTANSI_PENILAI"),
          });
        }

        if (!role) {
          role = await tx.query.roles.findFirst({
            where: eq(roles.code, "USER"),
          });
        }

        if (!role) {
          throw new Error("Default role not found");
        }

        // 1. Insert into users table
        const [userResult] = await tx.insert(users).values({
          username: data.virtual_account,
          password: data.password, // Hash is done in service
          role_id: role.id,
          is_active: true,
        });

        const newUserId = userResult.insertId;

        // 2. Insert into pembimbings table
        const result = await tx.insert(pembimbings).values({
          kkl_klp_id: data.kkl_klp_id,
          virtual_account: data.virtual_account,
          password: data.password,
          nama: data.nama,
          jabatan: data.jabatan,
          user_id: newUserId,
        });

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to create pembimbing lapangan: ${error}`);
    }
  }

  static async updatePembimbing(id: number, data: UpdatePembimbingLapanganRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        const pembimbing = await tx.query.pembimbings.findFirst({
          where: eq(pembimbings.id, id)
        });

        if (!pembimbing) throw new Error("Pembimbing Lapangan not found");

        if (data.virtual_account || data.password) {
          const userUpdateData: any = {};
          if (data.virtual_account) userUpdateData.username = data.virtual_account;
          if (data.password) userUpdateData.password = data.password;

          await tx
            .update(users)
            .set({ ...userUpdateData, updated_at: new Date() })
            .where(eq(users.id, pembimbing.user_id));
        }

        return await tx
          .update(pembimbings)
          .set({
            ...data,
            updated_at: new Date(),
          })
          .where(eq(pembimbings.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to update pembimbing lapangan: ${error}`);
    }
  }

  static async deletePembimbing(id: number) {
    try {
      return await db.transaction(async (tx) => {
        const pembimbing = await tx.query.pembimbings.findFirst({
          where: eq(pembimbings.id, id)
        });

        if (!pembimbing) throw new Error("Pembimbing Lapangan not found");

        const result = await tx.delete(pembimbings).where(eq(pembimbings.id, id));
        
        // Also delete the user
        await tx.delete(users).where(eq(users.id, pembimbing.user_id));

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to delete pembimbing lapangan: ${error}`);
    }
  }
}
