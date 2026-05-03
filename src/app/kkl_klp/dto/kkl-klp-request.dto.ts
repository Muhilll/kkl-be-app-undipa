export type CreateKklKlpRequestDto = {
  nama: string;
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
};

export type UpdateKklKlpRequestDto = Partial<{
  nama: string;
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
}>;
