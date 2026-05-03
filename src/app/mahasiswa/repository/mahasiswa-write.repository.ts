import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { mahasiswas, users, roles } from "../../../db/schema";
import {
  CreateMahasiswaRequestDto,
  UpdateMahasiswaRequestDto,
} from "../dto/mahasiswa-request.dto";

export class MahasiswaWriteRepository {
  static async createMahasiswa(data: CreateMahasiswaRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        // Find MAHASISWA role, fallback to USER if MAHASISWA not found
        let role = await tx.query.roles.findFirst({
          where: eq(roles.code, "MAHASISWA"),
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
          username: data.nim,
          password: data.password, // This is already hashed by service
          role_id: role.id,
          is_active: true,
        });

        const newUserId = userResult.insertId;

        // 2. Insert into mahasiswas table
        const result = await tx.insert(mahasiswas).values({
          nim: data.nim,
          password: data.password,
          nama: data.nama,
          email: data.email,
          telp: data.telp ?? null,
          foto: data.foto ?? null,
          image_public_id: data.image_public_id ?? null,
          jurusan_id: data.jurusan_id,
          user_id: newUserId,
        });

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to create mahasiswa: ${error}`);
    }
  }

  static async updateMahasiswa(id: number, data: UpdateMahasiswaRequestDto) {
    try {
      return await db.transaction(async (tx) => {
        // If updating nim or password, we should update the users table too
        // Since we don't have user_id easily available here without query, we can query it
        const mahasiswa = await tx.query.mahasiswas.findFirst({
          where: eq(mahasiswas.id, id)
        });

        if (!mahasiswa) throw new Error("Mahasiswa not found");

        if (data.nim || data.password) {
          const userUpdateData: any = {};
          if (data.nim) userUpdateData.username = data.nim;
          if (data.password) userUpdateData.password = data.password;

          await tx
            .update(users)
            .set({ ...userUpdateData, updated_at: new Date() })
            .where(eq(users.id, mahasiswa.user_id));
        }

        return await tx
          .update(mahasiswas)
          .set({
            ...data,
            updated_at: new Date(),
          })
          .where(eq(mahasiswas.id, id));
      });
    } catch (error) {
      throw new Error(`Failed to update mahasiswa: ${error}`);
    }
  }

  static async deleteMahasiswa(id: number) {
    try {
      return await db.transaction(async (tx) => {
        const mahasiswa = await tx.query.mahasiswas.findFirst({
          where: eq(mahasiswas.id, id)
        });

        if (!mahasiswa) throw new Error("Mahasiswa not found");

        const result = await tx.delete(mahasiswas).where(eq(mahasiswas.id, id));
        
        // Also delete the user
        await tx.delete(users).where(eq(users.id, mahasiswa.user_id));

        return result;
      });
    } catch (error) {
      throw new Error(`Failed to delete mahasiswa: ${error}`);
    }
  }
}
