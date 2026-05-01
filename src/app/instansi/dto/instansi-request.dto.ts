export type CreateInstansiRequestDto = {
  kode: string;
  nama: string;
  alamat: string;
  telp?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};

export type UpdateInstansiRequestDto = Partial<{
  kode: string;
  nama: string;
  alamat: string;
  telp: string | null;
  latitude: string | null;
  longitude: string | null;
}>;
