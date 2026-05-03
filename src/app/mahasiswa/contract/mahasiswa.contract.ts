export type MahasiswaEntity = {
  id: number;
  nim: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  jurusan_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  jurusan?: {
    kode: string;
    nama: string;
  };
};
