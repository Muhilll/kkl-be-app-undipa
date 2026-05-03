export type KklAgtEntity = {
  id: number;
  kkl_klp_id: number;
  mahasiswa_id: number;
  created_at: Date;
  updated_at: Date;
  mahasiswa: {
    id: number;
    nama: string;
    nim: string;
  } | null;
  kkl_klp: {
    id: number;
    kkl_periode: {
      id: number;
      nama: string;
      tahun: number;
      semester: string;
    } | null;
    instansi: {
      id: number;
      nama: string;
    } | null;
    dosen: {
      id: number;
      nidn: string;
      nama: string;
    } | null;
  } | null;
};
