export type CreatePembimbingRequestDto = {
  nidn: string;
  password: string;
  nama: string;
  email: string;
  telp?: string | null;
  foto?: string | null;
  image_public_id?: string | null;
  user_id: number;
};

export type UpdatePembimbingRequestDto = Partial<{
  nidn: string;
  password: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  user_id: number;
}>;
