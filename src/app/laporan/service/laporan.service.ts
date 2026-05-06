import {
  CreateLaporanRequestDto,
  UpdateLaporanRequestDto,
} from "../dto/laporan-request.dto";
import { LaporanReadRepository } from "../repository/laporan-read.repository";
import { LaporanWriteRepository } from "../repository/laporan-write.repository";
import { deleteImageFromCloudinarySafely } from "../../../utils/cloudinary";

export class LaporanService {
  static async getAllLaporans() {
    return LaporanReadRepository.getAllLaporans();
  }

  static async getLaporanById(id: number) {
    return LaporanReadRepository.getLaporanById(id);
  }

  static async getLaporansByMahasiswaId(mahasiswaId: number) {
    return LaporanReadRepository.getLaporansByMahasiswaId(mahasiswaId);
  }

  static async checkTodayLaporanByMahasiswaId(mahasiswaId: number) {
    return LaporanReadRepository.checkTodayLaporanByMahasiswaId(mahasiswaId);
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

    if (payload.file_public_id && laporan.file_public_id && payload.file_public_id !== laporan.file_public_id) {
      await deleteImageFromCloudinarySafely(laporan.file_public_id);
    }

    const result = await LaporanWriteRepository.updateLaporan(id, payload);
    return { laporan, result };
  }

  static async deleteLaporan(id: number) {
    const laporan = await LaporanReadRepository.getLaporanById(id);

    if (!laporan) {
      return null;
    }

    if (laporan.file_public_id) {
      await deleteImageFromCloudinarySafely(laporan.file_public_id);
    }

    const result = await LaporanWriteRepository.deleteLaporan(id);
    return { laporan, result };
  }
}
