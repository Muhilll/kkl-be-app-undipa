export type CreateJurusanRequestDto = {
  kode: string;
  nama: string;
};

export type UpdateJurusanRequestDto = Partial<{
  kode: string;
  nama: string;
}>;
