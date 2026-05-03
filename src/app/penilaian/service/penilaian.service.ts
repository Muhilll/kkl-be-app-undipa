import {
  CreatePenilaianRequestDto,
  UpdatePenilaianRequestDto,
} from "../dto/penilaian-request.dto";
import { PenilaianResponseDto } from "../dto/penilaian-response.dto";
import { PenilaianReadRepository } from "../repository/penilaian-read.repository";
import { PenilaianWriteRepository } from "../repository/penilaian-write.repository";

export class PenilaianService {
  static async getAllPenilaians(): Promise<PenilaianResponseDto[]> {
    return PenilaianReadRepository.getAllPenilaians();
  }

  static async getPenilaianById(
    id: number,
  ): Promise<PenilaianResponseDto | null> {
    return PenilaianReadRepository.getPenilaianById(id);
  }

  static async createPenilaian(payload: CreatePenilaianRequestDto) {
    const result = await PenilaianWriteRepository.createPenilaian(payload);
    return { result };
  }

  static async updatePenilaian(
    id: number,
    payload: UpdatePenilaianRequestDto,
  ) {
    const penilaian = await PenilaianReadRepository.getPenilaianById(id);

    if (!penilaian) {
      return null;
    }

    const result = await PenilaianWriteRepository.updatePenilaian(
      id,
      payload,
    );

    return { penilaian, result };
  }

  static async deletePenilaian(id: number) {
    const penilaian = await PenilaianReadRepository.getPenilaianById(id);

    if (!penilaian) {
      return null;
    }

    const result = await PenilaianWriteRepository.deletePenilaian(id);

    return { penilaian, result };
  }
}
