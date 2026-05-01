import {
  CreateJurusanRequestDto,
  UpdateJurusanRequestDto,
} from "../dto/jurusan-request.dto";
import { JurusanResponseDto } from "../dto/jurusan-response.dto";
import { JurusanReadRepository } from "../repository/jurusan-read.repository";
import { JurusanWriteRepository } from "../repository/jurusan-write.repository";

export class JurusanService {
  static async getAllJurusans(): Promise<JurusanResponseDto[]> {
    return JurusanReadRepository.getAllJurusans();
  }

  static async getJurusanById(id: number): Promise<JurusanResponseDto | null> {
    return JurusanReadRepository.getJurusanById(id);
  }

  static async createJurusan(payload: CreateJurusanRequestDto) {
    const existingJurusan = await JurusanReadRepository.getJurusanByKode(
      payload.kode,
    );

    if (existingJurusan) {
      return { conflict: true as const };
    }

    const result = await JurusanWriteRepository.createJurusan(payload);
    return { conflict: false as const, result };
  }

  static async updateJurusan(id: number, payload: UpdateJurusanRequestDto) {
    const jurusan = await JurusanReadRepository.getJurusanById(id);

    if (!jurusan) {
      return null;
    }

    const result = await JurusanWriteRepository.updateJurusan(id, payload);
    return { jurusan, result };
  }

  static async deleteJurusan(id: number) {
    const jurusan = await JurusanReadRepository.getJurusanById(id);

    if (!jurusan) {
      return null;
    }

    const result = await JurusanWriteRepository.deleteJurusan(id);
    return { jurusan, result };
  }
}
