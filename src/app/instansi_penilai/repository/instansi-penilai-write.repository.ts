import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { instansi_penilais, users, roles } from "../../../db/schema";
import {
  CreateInstansiPenilaiRequestDto,
  UpdateInstansiPenilaiRequestDto,
} from "../dto/instansi-penilai-request.dto";

export class InstansiPenilaiWriteRepository {
  static async createInstansiPenilai(data: CreateInstansiPenilaiRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        // Find INSTANSI_PENILAI role, fallback to USER
        let role = await tx.query.roles.findFirst({
          where: eq(roles.code, "INSTANSI_PENILAI"),
        });

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

        // 2. Insert into instansi_penilais table
        const result = await tx.insert(instansi_penilais).values({
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
      throw new Error(`Failed to create instansi penilai: ${error}`);
    }
  }

  static async updateInstansiPenilai(id: number, data: UpdateInstansiPenilaiRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        const instansiPenilai = await tx.query.instansi_penilais.findFirst({
          where: eq(instansi_penilais.id, id)
        });

        if (!instansiPenilai) throw new Error("Instansi Penilai not found");

        if (data.virtual_account || data.password) {
          const userUpdateData: any = {};
          if (data.virtual_account) userUpdateData.username = data.virtual_account;
          if (data.password) userUpdateData.password = data.password;

          await tx
            .update(users)
            .set({ ...userUpdateData, updated_at: new Date() })
            .where(eq(users.id, instansiPenilai.user_id));
        }

        return await tx
          .update(instansi_penilais)
          .set({
            ...data,
            updated_at: new Date(),
          })
          .where(eq(instansi_penilais.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to update instansi penilai: ${error}`);
    }
  }

  static async deleteInstansiPenilai(id: number) {
    try {
      return await db.transaction(async (tx) => {
        const instansiPenilai = await tx.query.instansi_penilais.findFirst({
          where: eq(instansi_penilais.id, id)
        });

        if (!instansiPenilai) throw new Error("Instansi Penilai not found");

        const result = await tx.delete(instansi_penilais).where(eq(instansi_penilais.id, id));
        
        // Also delete the user
        await tx.delete(users).where(eq(users.id, instansiPenilai.user_id));

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to delete instansi penilai: ${error}`);
    }
  }
}
