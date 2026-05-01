import { Semester } from "../contract/kkl-periode.contract";

export type CreateKklPeriodeRequestDto = {
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
};

export type UpdateKklPeriodeRequestDto = Partial<{
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
}>;
