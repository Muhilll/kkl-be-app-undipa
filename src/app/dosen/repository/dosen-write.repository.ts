import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { dosens, users, roles } from "../../../db/schema";
import {
  CreateDosenRequestDto,
  UpdateDosenRequestDto,
} from "../dto/dosen-request.dto";

export class DosenWriteRepository {
  static async createDosen(data: CreateDosenRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        // Find DOSEN role, fallback to USER if DOSEN not found
        let role = await tx.query.roles.findFirst({
          where: eq(roles.code, "DOSEN"),
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
          username: data.nidn,
          password: data.password, // This is already hashed by service
          role_id: role.id,
          is_active: true,
        });

        const newUserId = userResult.insertId;

        // 2. Insert into dosens table
        const result = await tx.insert(dosens).values({
          nidn: data.nidn,
          password: data.password,
          nama: data.nama,
          email: data.email,
          telp: data.telp ?? null,
          foto: data.foto ?? null,
          image_public_id: data.image_public_id ?? null,
          user_id: newUserId,
        });

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to create dosen: ${error}`);
    }
  }

  static async updateDosen(id: number, data: UpdateDosenRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        const dosen = await tx.query.dosens.findFirst({
          where: eq(dosens.id, id)
        });

        if (!dosen) throw new Error("Dosen not found");

        if (data.nidn || data.password) {
          const userUpdateData: any = {};
          if (data.nidn) userUpdateData.username = data.nidn;
          if (data.password) userUpdateData.password = data.password;

          await tx
            .update(users)
            .set({ ...userUpdateData, updated_at: new Date() })
            .where(eq(users.id, dosen.user_id));
        }

        return await tx
          .update(dosens)
          .set({
            ...data,
            updated_at: new Date(),
          })
          .where(eq(dosens.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to update dosen: ${error}`);
    }
  }

  static async deleteDosen(id: number) {
    try {
      return await db.transaction(async (tx) => {
        const dosen = await tx.query.dosens.findFirst({
          where: eq(dosens.id, id)
        });

        if (!dosen) throw new Error("Dosen not found");

        const result = await tx.delete(dosens).where(eq(dosens.id, id));
        
        // Also delete the user
        await tx.delete(users).where(eq(users.id, dosen.user_id));

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to delete dosen: ${error}`);
    }
  }
}
