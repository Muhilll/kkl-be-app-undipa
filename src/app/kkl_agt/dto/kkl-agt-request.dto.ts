export type CreateKklAgtRequestDto = {
  kkl_klp_id: number;
  mahasiswa_id: number;
};

export type UpdateKklAgtRequestDto = Partial<{
  kkl_klp_id: number;
  mahasiswa_id: number;
}>;
