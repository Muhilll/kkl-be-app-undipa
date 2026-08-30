import {
  CreateLaporanRequestDto,
  UpdateLaporanRequestDto,
} from "../dto/laporan-request.dto";
import { LaporanReadRepository } from "../repository/laporan-read.repository";
import { LaporanWriteRepository } from "../repository/laporan-write.repository";
import { deleteImageFromCloudinarySafely } from "../../../utils/cloudinary";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;
  const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);
  const RADIUS_OF_EARTH_IN_METERS = 6371e3;

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return RADIUS_OF_EARTH_IN_METERS * c;
}

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
    const isActive = await LaporanReadRepository.checkKklAgtIsActive(payload.kkl_agt_id);
    if (!isActive) {
      return { error: "Laporan ditolak. Periode KKL sudah berakhir." };
    }

    // Hitung jarak dan validasi status di sisi server
    if (payload.latitude && payload.longitude) {
      const instansiLocation = await LaporanReadRepository.getInstansiLocationByAgtId(payload.kkl_agt_id);
      if (instansiLocation && instansiLocation.latitude && instansiLocation.longitude) {
        const dist = haversineDistance(
          parseFloat(payload.latitude),
          parseFloat(payload.longitude),
          parseFloat(instansiLocation.latitude as any),
          parseFloat(instansiLocation.longitude as any)
        );
        payload.jarak = Math.round(dist).toString();
        payload.status = dist < 300.0 ? "valid" : "invalid";
      } else {
        payload.jarak = null as any;
        payload.status = "invalid";
      }
    } else {
      payload.jarak = null as any;
      payload.status = "invalid";
    }

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
