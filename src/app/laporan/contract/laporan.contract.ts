export type LaporanEntity = {
  id: number;
  kkl_agt_id: number;
  tanggal: string;
  jam: string;
  aktifitas: string;
  file: string | null;
  file_public_id: string | null;
  latitude: string | null;
  longitude: string | null;
  jarak: string | null;
  status: "valid" | "invalid";
  created_at: Date;
  updated_at: Date;
};
