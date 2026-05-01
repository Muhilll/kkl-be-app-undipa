import {
  CreateInstansiRequestDto,
  UpdateInstansiRequestDto,
} from "../dto/instansi-request.dto";
import { InstansiResponseDto } from "../dto/instansi-response.dto";
import { InstansiReadRepository } from "../repository/instansi-read.repository";
import { InstansiWriteRepository } from "../repository/instansi-write.repository";

export class InstansiService {
  static async getAllInstansis(): Promise<InstansiResponseDto[]> {
    return InstansiReadRepository.getAllInstansis();
  }

  static async getInstansiById(id: number): Promise<InstansiResponseDto | null> {
    return InstansiReadRepository.getInstansiById(id);
  }

  static async createInstansi(payload: CreateInstansiRequestDto) {
    const existingInstansi = await InstansiReadRepository.getInstansiByKode(
      payload.kode,
    );

    if (existingInstansi) {
      return { conflict: true as const };
    }

    const result = await InstansiWriteRepository.createInstansi(payload);
    return { conflict: false as const, result };
  }

  static async updateInstansi(id: number, payload: UpdateInstansiRequestDto) {
    const instansi = await InstansiReadRepository.getInstansiById(id);

    if (!instansi) {
      return null;
    }

    const result = await InstansiWriteRepository.updateInstansi(id, payload);
    return { instansi, result };
  }

  static async deleteInstansi(id: number) {
    const instansi = await InstansiReadRepository.getInstansiById(id);

    if (!instansi) {
      return null;
    }

    const result = await InstansiWriteRepository.deleteInstansi(id);
    return { instansi, result };
  }
}
