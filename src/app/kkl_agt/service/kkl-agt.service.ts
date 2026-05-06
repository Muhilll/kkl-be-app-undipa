import {
  CreateKklAgtRequestDto,
  UpdateKklAgtRequestDto,
} from "../dto/kkl-agt-request.dto";
import { KklAgtReadRepository } from "../repository/kkl-agt-read.repository";
import { KklAgtWriteRepository } from "../repository/kkl-agt-write.repository";
import { KklKlpReadRepository } from "../../kkl_klp/repository/kkl-klp-read.repository";

export class KklAgtService {
  static async getAllKklAgts() {
    return KklAgtReadRepository.getAllKklAgts();
  }

  static async getKklAgtById(id: number) {
    return KklAgtReadRepository.getKklAgtById(id);
  }

  static async getKklAgtDetailByMahasiswaId(mahasiswaId: number) {
    return KklAgtReadRepository.getKklAgtDetailByMahasiswaId(mahasiswaId);
  }

  static async getKklAgtsByKlpId(klpId: number) {
    return KklAgtReadRepository.getKklAgtsByKlpId(klpId);
  }

  static async createKklAgt(payload: CreateKklAgtRequestDto) {
    const targetKlp = await KklKlpReadRepository.getKklKlpById(payload.kkl_klp_id);
    if (!targetKlp) {
      return { conflict: true as const, message: "Kelompok KKL tidak ditemukan." };
    }

    const existingMahasiswa = await KklAgtReadRepository.getKklAgtByMahasiswaAndPeriode(payload.mahasiswa_id, targetKlp.kkl_periode_id);
    if (existingMahasiswa) {
      return { conflict: true as const, message: "Mahasiswa sudah terdaftar di kelompok lain pada periode ini." };
    }

    const existingKklAgt =
      await KklAgtReadRepository.getKklAgtByGroupAndMahasiswa(
        payload.kkl_klp_id,
        payload.mahasiswa_id,
      );

    if (existingKklAgt) {
      return { conflict: true as const, message: "Mahasiswa ini sudah ada di kelompok ini." };
    }

    const result = await KklAgtWriteRepository.createKklAgt(payload);
    return { conflict: false as const, result };
  }

  static async updateKklAgt(id: number, payload: UpdateKklAgtRequestDto) {
    const kklAgt = await KklAgtReadRepository.getKklAgtById(id);

    if (!kklAgt) {
      return null;
    }

    if (payload.mahasiswa_id || payload.kkl_klp_id) {
      const targetKlpId = payload.kkl_klp_id || kklAgt.kkl_klp_id;
      const targetMhsId = payload.mahasiswa_id || kklAgt.mahasiswa_id;
      
      const targetKlp = await KklKlpReadRepository.getKklKlpById(targetKlpId);
      if (targetKlp) {
        const existingMahasiswa = await KklAgtReadRepository.getKklAgtByMahasiswaAndPeriode(targetMhsId, targetKlp.kkl_periode_id);
        if (existingMahasiswa && existingMahasiswa.id !== id) {
          return { conflict: true as const, message: "Mahasiswa sudah terdaftar di kelompok lain pada periode ini." };
        }
      }
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
