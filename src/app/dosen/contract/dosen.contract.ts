export type DosenEntity = {
  id: number;
  nidn: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  user_id: number;
  created_at: Date;
  updated_at: Date;
};
