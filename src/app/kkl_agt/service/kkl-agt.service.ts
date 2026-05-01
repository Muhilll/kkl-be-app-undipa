import {
  CreateKklAgtRequestDto,
  UpdateKklAgtRequestDto,
} from "../dto/kkl-agt-request.dto";
import { KklAgtResponseDto } from "../dto/kkl-agt-response.dto";
import { KklAgtReadRepository } from "../repository/kkl-agt-read.repository";
import { KklAgtWriteRepository } from "../repository/kkl-agt-write.repository";

export class KklAgtService {
  static async getAllKklAgts(): Promise<KklAgtResponseDto[]> {
    return KklAgtReadRepository.getAllKklAgts();
  }

  static async getKklAgtById(id: number): Promise<KklAgtResponseDto | null> {
    return KklAgtReadRepository.getKklAgtById(id);
  }

  static async createKklAgt(payload: CreateKklAgtRequestDto) {
    const existingKklAgt =
      await KklAgtReadRepository.getKklAgtByGroupAndMahasiswa(
        payload.kkl_klp_id,
        payload.mahasiswa_id,
      );

    if (existingKklAgt) {
      return { conflict: true as const };
    }

    const result = await KklAgtWriteRepository.createKklAgt(payload);
    return { conflict: false as const, result };
  }

  static async updateKklAgt(id: number, payload: UpdateKklAgtRequestDto) {
    const kklAgt = await KklAgtReadRepository.getKklAgtById(id);

    if (!kklAgt) {
      return null;
    }

    const result = await KklAgtWriteRepository.updateKklAgt(id, payload);
    return { kklAgt, result };
  }

  static async deleteKklAgt(id: number) {
    const kklAgt = await KklAgtReadRepository.getKklAgtById(id);

    if (!kklAgt) {
      return null;
    }

    const result = await KklAgtWriteRepository.deleteKklAgt(id);
    return { kklAgt, result };
  }
}
