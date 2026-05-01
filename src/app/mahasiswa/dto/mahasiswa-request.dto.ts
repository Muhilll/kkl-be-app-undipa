export type CreateMahasiswaRequestDto = {
  nim: string;
  password: string;
  nama: string;
  email: string;
  telp?: string | null;
  foto?: string | null;
  image_public_id?: string | null;
  jurusan_id: number;
  user_id: number;
};

export type UpdateMahasiswaRequestDto = Partial<{
  nim: string;
  password: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  jurusan_id: number;
  user_id: number;
}>;
