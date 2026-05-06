import { hash } from "bcryptjs";
import {
  CreatePembimbingLapanganRequestDto,
  UpdatePembimbingLapanganRequestDto,
} from "../dto/pembimbing-lapangan-request.dto";
import { PembimbingLapanganResponseDto } from "../dto/pembimbing-lapangan-response.dto";
import { PembimbingLapanganReadRepository } from "../repository/pembimbing-lapangan-read.repository";
import { PembimbingLapanganWriteRepository } from "../repository/pembimbing-lapangan-write.repository";

export class PembimbingLapanganService {
  static async getAllPembimbings(): Promise<PembimbingLapanganResponseDto[]> {
    return PembimbingLapanganReadRepository.getAllPembimbings();
  }

  static async getPembimbingById(
    id: number,
  ): Promise<PembimbingLapanganResponseDto | null> {
    return PembimbingLapanganReadRepository.getPembimbingById(id);
  }

  static async createPembimbing(payload: CreatePembimbingLapanganRequestDto) {
    const existingPembimbing =
      await PembimbingLapanganReadRepository.getPembimbingByUniqueFields(
        payload.virtual_account,
      );

    if (existingPembimbing) {
      return { conflict: true as const, reason: "virtual_account" };
    }

    const existingKlp = await PembimbingLapanganReadRepository.getPembimbingByKlpId(
      payload.kkl_klp_id,
    );

    if (existingKlp) {
      return { conflict: true as const, reason: "kkl_klp_id" };
    }

    const hashedPassword = await hash(payload.password, 10);
    const result = await PembimbingLapanganWriteRepository.createPembimbing({
      ...payload,
      password: hashedPassword,
    });

    return { conflict: false as const, result };
  }

  static async updatePembimbing(
    id: number,
    payload: UpdatePembimbingLapanganRequestDto,
  ) {
    const pembimbing = await PembimbingLapanganReadRepository.getPembimbingById(id);

    if (!pembimbing) {
      return null;
    }

    const updateData = { ...payload };

    if (payload.kkl_klp_id && payload.kkl_klp_id !== pembimbing.kkl_klp_id) {
      const existingKlp = await PembimbingLapanganReadRepository.getPembimbingByKlpId(
        payload.kkl_klp_id,
      );

      if (existingKlp) {
        return { conflict: true as const, reason: "kkl_klp_id" };
      }
    }

    if (payload.password && payload.password.trim() !== "") {
      updateData.password = await hash(payload.password, 10);
    } else {
      delete updateData.password;
    }

    const result = await PembimbingLapanganWriteRepository.updatePembimbing(
      id,
      updateData,
    );

    return { pembimbing, result };
  }

  static async deletePembimbing(id: number) {
    const pembimbing = await PembimbingLapanganReadRepository.getPembimbingById(id);

    if (!pembimbing) {
      return null;
    }

    const result = await PembimbingLapanganWriteRepository.deletePembimbing(id);

    return { pembimbing, result };
  }
}
