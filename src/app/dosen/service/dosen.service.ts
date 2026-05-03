import { hash } from "bcryptjs";
import { deleteImageFromCloudinarySafely } from "../../../utils/cloudinary";
import {
  CreateDosenRequestDto,
  UpdateDosenRequestDto,
} from "../dto/dosen-request.dto";
import { DosenResponseDto } from "../dto/dosen-response.dto";
import { DosenReadRepository } from "../repository/dosen-read.repository";
import { DosenWriteRepository } from "../repository/dosen-write.repository";

export class DosenService {
  static async getAllDosens(): Promise<DosenResponseDto[]> {
    return DosenReadRepository.getAllDosens();
  }

  static async getDosenById(
    id: number,
  ): Promise<DosenResponseDto | null> {
    return DosenReadRepository.getDosenById(id);
  }

  static async createDosen(payload: CreateDosenRequestDto) {
    const existingDosen = await DosenReadRepository.getDosenByUniqueFields(
      payload.nidn,
      payload.email,
    );

    if (existingDosen) {
      return { conflict: true as const };
    }

    const hashedPassword = await hash(payload.password, 10);
    const result = await DosenWriteRepository.createDosen({
      ...payload,
      password: hashedPassword,
    });

    return { conflict: false as const, result };
  }

  static async updateDosen(
    id: number,
    payload: UpdateDosenRequestDto,
  ) {
    const dosen = await DosenReadRepository.getDosenById(id);

    if (!dosen) {
      return null;
    }

    const updateData = { ...payload };

    if (payload.password) {
      updateData.password = await hash(payload.password, 10);
    }

    const result = await DosenWriteRepository.updateDosen(
      id,
      updateData,
    );

    if (
      "image_public_id" in payload &&
      payload.image_public_id !== dosen.image_public_id
    ) {
      await deleteImageFromCloudinarySafely(dosen.image_public_id);
    }

    return { dosen, result };
  }

  static async deleteDosen(id: number) {
    const dosen = await DosenReadRepository.getDosenById(id);

    if (!dosen) {
      return null;
    }

    const result = await DosenWriteRepository.deleteDosen(id);
    await deleteImageFromCloudinarySafely(dosen.image_public_id);

    return { dosen, result };
  }
}
