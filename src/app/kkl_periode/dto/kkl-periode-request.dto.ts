import { Semester } from "../contract/kkl-periode.contract";

export type CreateKklPeriodeRequestDto = {
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  is_active?: boolean;
};
export type UpdateKklPeriodeRequestDto = Partial<{
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  is_active: boolean;
}>;
