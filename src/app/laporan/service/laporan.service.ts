import {
  CreateLaporanRequestDto,
  UpdateLaporanRequestDto,
} from "../dto/laporan-request.dto";
import { LaporanReadRepository } from "../repository/laporan-read.repository";
import { LaporanWriteRepository } from "../repository/laporan-write.repository";

export class LaporanService {
  static async getAllLaporans() {
    return LaporanReadRepository.getAllLaporans();
  }

  static async getLaporanById(id: number) {
    return LaporanReadRepository.getLaporanById(id);
  }

  static async createLaporan(payload: CreateLaporanRequestDto) {
    const result = await LaporanWriteRepository.createLaporan(payload);
    return { result };
  }

  static async updateLaporan(id: number, payload: UpdateLaporanRequestDto) {
    const laporan = await LaporanReadRepository.getLaporanById(id);

    if (!laporan) {
      return null;
    }

    const result = await LaporanWriteRepository.updateLaporan(id, payload);
    return { laporan, result };
  }

  static async deleteLaporan(id: number) {
    const laporan = await LaporanReadRepository.getLaporanById(id);

    if (!laporan) {
      return null;
    }

    const result = await LaporanWriteRepository.deleteLaporan(id);
    return { laporan, result };
  }
}
