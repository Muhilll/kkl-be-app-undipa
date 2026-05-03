export type CreateKklKlpRequestDto = {
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
};

export type UpdateKklKlpRequestDto = Partial<{
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
}>;
