import { eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { dosens } from "../../../db/schema";

const dosenSelect = {
  id: dosens.id,
  nidn: dosens.nidn,
  nama: dosens.nama,
  email: dosens.email,
  telp: dosens.telp,
  foto: dosens.foto,
  image_public_id: dosens.image_public_id,
  user_id: dosens.user_id,
  created_at: dosens.created_at,
  updated_at: dosens.updated_at,
};

export class DosenReadRepository {
  static async getAllDosens() {
    try {
      return await db.select(dosenSelect).from(dosens);
    } catch (error) {
      throw new Error(`Failed to fetch dosens: ${error}`);
    }
  }

  static async getDosenById(id: number) {
    try {
      const result = await db
        .select(dosenSelect)
        .from(dosens)
        .where(eq(dosens.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dosen: ${error}`);
    }
  }

  static async getDosenByUniqueFields(
    nidn: string,
    email: string,
    userId: number,
  ) {
    try {
      const result = await db
        .select(dosenSelect)
        .from(dosens)
        .where(
          or(
            eq(dosens.nidn, nidn),
            eq(dosens.email, email),
            eq(dosens.user_id, userId),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dosen: ${error}`);
    }
  }
}
