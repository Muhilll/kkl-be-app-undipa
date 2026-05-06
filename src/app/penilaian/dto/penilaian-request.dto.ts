export type CreatePenilaianRequestDto = {
  kkl_agt_id: number;
  pembimbing_id: number;
  lama_praktek: number;
  kehadiran: number;
  disiplin: number;
  kejujuran: number;
  kerajinan: number;
  kerja_sama: number;
  sikap: number;
  inisiatif: number;
  tanggung_jawab: number;
  komunikasi: number;
  kebersihan: number;
  penampilan: number;
  kecakapan: number;
  total: number;
  ratarata: string;
};

export type UpdatePenilaianRequestDto = Partial<{
  kkl_agt_id: number;
  pembimbing_id: number;
  lama_praktek: number;
  kehadiran: number;
  disiplin: number;
  kejujuran: number;
  kerajinan: number;
  kerja_sama: number;
  sikap: number;
  inisiatif: number;
  tanggung_jawab: number;
  komunikasi: number;
  kebersihan: number;
  penampilan: number;
  kecakapan: number;
  total: number;
  ratarata: string;
}>;
