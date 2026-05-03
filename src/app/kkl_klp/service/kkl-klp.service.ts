import {
  CreateKklKlpRequestDto,
  UpdateKklKlpRequestDto,
} from "../dto/kkl-klp-request.dto";
import { KklKlpResponseDto } from "../dto/kkl-klp-response.dto";
import { KklKlpReadRepository } from "../repository/kkl-klp-read.repository";
import { KklKlpWriteRepository } from "../repository/kkl-klp-write.repository";

export class KklKlpService {
  static async getAllKklKlps(): Promise<KklKlpResponseDto[]> {
    return KklKlpReadRepository.getAllKklKlps();
  }

  static async getKklKlpById(id: number): Promise<KklKlpResponseDto | null> {
    return KklKlpReadRepository.getKklKlpById(id);
  }

  static async createKklKlp(payload: CreateKklKlpRequestDto) {
    const existingDosenGroup = await KklKlpReadRepository.getKklKlpByDosenAndPeriode(payload.dosen_id, payload.kkl_periode_id);
    if (existingDosenGroup) {
      return { conflict: true as const, message: "Dosen sudah ditugaskan ke kelompok lain pada periode ini." };
    }

    const existingKklKlp = await KklKlpReadRepository.getKklKlpByGroupKeys(
      payload.kkl_periode_id,
      payload.instansi_id,
      payload.dosen_id,
    );

    if (existingKklKlp) {
      return { conflict: true as const, message: "Kelompok KKL dengan konfigurasi ini sudah ada." };
    }

    const result = await KklKlpWriteRepository.createKklKlp(payload);
    return { conflict: false as const, result };
  }

  static async updateKklKlp(id: number, payload: UpdateKklKlpRequestDto) {
    const kklKlp = await KklKlpReadRepository.getKklKlpById(id);

    if (!kklKlp) {
      return null;
    }

    if (payload.dosen_id) {
      const kklPeriodeId = payload.kkl_periode_id || kklKlp.kkl_periode_id;
      const existingDosenGroup = await KklKlpReadRepository.getKklKlpByDosenAndPeriode(payload.dosen_id, kklPeriodeId);
      if (existingDosenGroup && existingDosenGroup.id !== id) {
        return { conflict: true as const, message: "Dosen sudah ditugaskan ke kelompok lain pada periode ini." };
      }
    }

    const result = await KklKlpWriteRepository.updateKklKlp(id, payload);
    return { kklKlp, result };
  }

  static async deleteKklKlp(id: number) {
    const kklKlp = await KklKlpReadRepository.getKklKlpById(id);

    if (!kklKlp) {
      return null;
    }

    const result = await KklKlpWriteRepository.deleteKklKlp(id);
    return { kklKlp, result };
  }
}
