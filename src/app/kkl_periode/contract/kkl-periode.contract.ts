export type Semester = "ganjil" | "genap";

export type KklPeriodeEntity = {
  id: number;
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  created_at: Date;
  updated_at: Date;
};
