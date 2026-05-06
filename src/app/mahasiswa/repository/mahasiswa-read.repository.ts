import { eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { mahasiswas, jurusans } from "../../../db/schema";

const mahasiswaSelect = {
  id: mahasiswas.id,
  nim: mahasiswas.nim,
  nama: mahasiswas.nama,
  email: mahasiswas.email,
  telp: mahasiswas.telp,
  foto: mahasiswas.foto,
  image_public_id: mahasiswas.image_public_id,
  jurusan_id: mahasiswas.jurusan_id,
  user_id: mahasiswas.user_id,
  created_at: mahasiswas.created_at,
  updated_at: mahasiswas.updated_at,
};

const jurusanSelect = {
  kode: jurusans.kode,
  nama: jurusans.nama,
};

export class MahasiswaReadRepository {
  static async getAllMahasiswas() {
    try {
      const rows = await db
        .select({ ...mahasiswaSelect, jurusan: jurusanSelect })
        .from(mahasiswas)
        .leftJoin(jurusans, eq(mahasiswas.jurusan_id, jurusans.id));

      return rows.map((row) => ({
        ...row,
        jurusan: row.jurusan ?? undefined,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch mahasiswas: ${error}`);
    }
  }

  static async getMahasiswaByUserId(userId: number) {
    try {
      const result = await db
        .select({ ...mahasiswaSelect, jurusan: jurusanSelect })
        .from(mahasiswas)
        .leftJoin(jurusans, eq(mahasiswas.jurusan_id, jurusans.id))
        .where(eq(mahasiswas.user_id, userId))
        .limit(1);

      if (!result[0]) return null;

      return {
        ...result[0],
        jurusan: result[0].jurusan ?? undefined,
      };
    } catch (error) {
      throw new Error(`Failed to fetch mahasiswa by user_id: ${error}`);
    }
  }

  static async getMahasiswaById(id: number) {
    try {
      const result = await db
        .select({ ...mahasiswaSelect, jurusan: jurusanSelect })
        .from(mahasiswas)
        .leftJoin(jurusans, eq(mahasiswas.jurusan_id, jurusans.id))
        .where(eq(mahasiswas.id, id))
        .limit(1);

      if (!result[0]) return null;

      return {
        ...result[0],
        jurusan: result[0].jurusan ?? undefined,
      };
    } catch (error) {
      throw new Error(`Failed to fetch mahasiswa: ${error}`);
    }
  }

  static async getMahasiswaByUniqueFields(
    nim: string,
    email: string,
  ) {
    try {
      const result = await db
        .select(mahasiswaSelect)
        .from(mahasiswas)
        .where(
          or(
            eq(mahasiswas.nim, nim),
            eq(mahasiswas.email, email),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch mahasiswa: ${error}`);
    }
  }
}
