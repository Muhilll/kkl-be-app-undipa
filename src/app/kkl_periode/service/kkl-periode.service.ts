import {
  CreateKklPeriodeRequestDto,
  UpdateKklPeriodeRequestDto,
} from "../dto/kkl-periode-request.dto";
import { KklPeriodeResponseDto } from "../dto/kkl-periode-response.dto";
import { KklPeriodeReadRepository } from "../repository/kkl-periode-read.repository";
import { KklPeriodeWriteRepository } from "../repository/kkl-periode-write.repository";

export class KklPeriodeService {
  static async getAllKklPeriodes(): Promise<KklPeriodeResponseDto[]> {
    return KklPeriodeReadRepository.getAllKklPeriodes();
  }

  static async getKklPeriodeById(
    id: number,
  ): Promise<KklPeriodeResponseDto | null> {
    return KklPeriodeReadRepository.getKklPeriodeById(id);
  }

  static async createKklPeriode(payload: CreateKklPeriodeRequestDto) {
    const existingKklPeriode =
      await KklPeriodeReadRepository.getKklPeriodeByTahunAndSemester(
        payload.tahun,
        payload.semester,
      );

    if (existingKklPeriode) {
      return { conflict: true as const };
    }

    const result = await KklPeriodeWriteRepository.createKklPeriode({
      ...payload,
      is_active: payload.is_active ?? false,
    });
    return { conflict: false as const, result };
  }

  static async updateKklPeriode(
    id: number,
    payload: UpdateKklPeriodeRequestDto,
  ) {
    const kklPeriode = await KklPeriodeReadRepository.getKklPeriodeById(id);

    if (!kklPeriode) {
      return null;
    }

    const result = await KklPeriodeWriteRepository.updateKklPeriode(
      id,
      payload,
    );
    return { kklPeriode, result };
  }

  static async activateKklPeriode(id: number) {
    const kklPeriode = await KklPeriodeReadRepository.getKklPeriodeById(id);

    if (!kklPeriode) {
      return null;
    }

    const result = await KklPeriodeWriteRepository.activateKklPeriode(id);
    return { kklPeriode, result };
  }

  static async deleteKklPeriode(id: number) {
    const kklPeriode = await KklPeriodeReadRepository.getKklPeriodeById(id);

    if (!kklPeriode) {
      return null;
    }

    const result = await KklPeriodeWriteRepository.deleteKklPeriode(id);
    return { kklPeriode, result };
  }
}
