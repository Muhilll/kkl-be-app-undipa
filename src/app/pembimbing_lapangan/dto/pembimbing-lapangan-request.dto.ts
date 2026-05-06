export type CreatePembimbingLapanganRequestDto = {
  kkl_klp_id: number;
  virtual_account: string;
  password: string;
  nama: string;
  jabatan: string;
};

export type UpdatePembimbingLapanganRequestDto = Partial<{
  kkl_klp_id: number;
  virtual_account: string;
  password: string;
  nama: string;
  jabatan: string;
}>;
