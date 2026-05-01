export type CreateKklKlpRequestDto = {
  kkl_periode_id: number;
  instansi_id: number;
  pembimbing_id: number;
};

export type UpdateKklKlpRequestDto = Partial<{
  kkl_periode_id: number;
  instansi_id: number;
  pembimbing_id: number;
}>;
