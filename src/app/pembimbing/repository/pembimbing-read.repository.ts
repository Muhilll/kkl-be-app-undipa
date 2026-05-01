import { eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { pembimbings } from "../../../db/schema";

const pembimbingSelect = {
  id: pembimbings.id,
  nidn: pembimbings.nidn,
  nama: pembimbings.nama,
  email: pembimbings.email,
  telp: pembimbings.telp,
  foto: pembimbings.foto,
  image_public_id: pembimbings.image_public_id,
  user_id: pembimbings.user_id,
  created_at: pembimbings.created_at,
  updated_at: pembimbings.updated_at,
};

export class PembimbingReadRepository {
  static async getAllPembimbings() {
    try {
      return await db.select(pembimbingSelect).from(pembimbings);
    } catch (error) {
      throw new Error(`Failed to fetch pembimbings: ${error}`);
    }
  }

  static async getPembimbingById(id: number) {
    try {
      const result = await db
        .select(pembimbingSelect)
        .from(pembimbings)
        .where(eq(pembimbings.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pembimbing: ${error}`);
    }
  }

  static async getPembimbingByUniqueFields(
    nidn: string,
    email: string,
    userId: number,
  ) {
    try {
      const result = await db
        .select(pembimbingSelect)
        .from(pembimbings)
        .where(
          or(
            eq(pembimbings.nidn, nidn),
            eq(pembimbings.email, email),
            eq(pembimbings.user_id, userId),
          ),
        )
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pembimbing: ${error}`);
    }
  }
}
