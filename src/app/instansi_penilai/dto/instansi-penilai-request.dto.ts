export type CreateInstansiPenilaiRequestDto = {
  kkl_klp_id: number;
  virtual_account: string;
  password: string;
  nama: string;
  jabatan: string;
};

export type UpdateInstansiPenilaiRequestDto = Partial<{
  kkl_klp_id: number;
  virtual_account: string;
  password: string;
  nama: string;
  jabatan: string;
}>;
