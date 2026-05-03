export type CreateDosenRequestDto = {
  nidn: string;
  password: string;
  nama: string;
  email: string;
  telp?: string | null;
  foto?: string | null;
  image_public_id?: string | null;
  user_id: number;
};

export type UpdateDosenRequestDto = Partial<{
  nidn: string;
  password: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  user_id: number;
}>;
