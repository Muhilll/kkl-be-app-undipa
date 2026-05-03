import { hash } from "bcryptjs";
import {
  CreateInstansiPenilaiRequestDto,
  UpdateInstansiPenilaiRequestDto,
} from "../dto/instansi-penilai-request.dto";
import { InstansiPenilaiResponseDto } from "../dto/instansi-penilai-response.dto";
import { InstansiPenilaiReadRepository } from "../repository/instansi-penilai-read.repository";
import { InstansiPenilaiWriteRepository } from "../repository/instansi-penilai-write.repository";

export class InstansiPenilaiService {
  static async getAllInstansiPenilais(): Promise<InstansiPenilaiResponseDto[]> {
    return InstansiPenilaiReadRepository.getAllInstansiPenilais();
  }

  static async getInstansiPenilaiById(
    id: number,
  ): Promise<InstansiPenilaiResponseDto | null> {
    return InstansiPenilaiReadRepository.getInstansiPenilaiById(id);
  }

  static async createInstansiPenilai(payload: CreateInstansiPenilaiRequestDto) {
    const existingInstansiPenilai =
      await InstansiPenilaiReadRepository.getInstansiPenilaiByUniqueFields(
        payload.virtual_account,
      );

    if (existingInstansiPenilai) {
      return { conflict: true as const };
    }

    const hashedPassword = await hash(payload.password, 10);
    const result = await InstansiPenilaiWriteRepository.createInstansiPenilai({
      ...payload,
      password: hashedPassword,
    });

    return { conflict: false as const, result };
  }

  static async updateInstansiPenilai(
    id: number,
    payload: UpdateInstansiPenilaiRequestDto,
  ) {
    const instansiPenilai = await InstansiPenilaiReadRepository.getInstansiPenilaiById(id);

    if (!instansiPenilai) {
      return null;
    }

    const updateData = { ...payload };

    if (payload.password) {
      updateData.password = await hash(payload.password, 10);
    }

    const result = await InstansiPenilaiWriteRepository.updateInstansiPenilai(
      id,
      updateData,
    );

    return { instansiPenilai, result };
  }

  static async deleteInstansiPenilai(id: number) {
    const instansiPenilai = await InstansiPenilaiReadRepository.getInstansiPenilaiById(id);

    if (!instansiPenilai) {
      return null;
    }

    const result = await InstansiPenilaiWriteRepository.deleteInstansiPenilai(id);

    return { instansiPenilai, result };
  }
}
