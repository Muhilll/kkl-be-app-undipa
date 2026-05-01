import { hash } from "bcryptjs";
import { deleteImageFromCloudinarySafely } from "../../../utils/cloudinary";
import {
  CreatePembimbingRequestDto,
  UpdatePembimbingRequestDto,
} from "../dto/pembimbing-request.dto";
import { PembimbingResponseDto } from "../dto/pembimbing-response.dto";
import { PembimbingReadRepository } from "../repository/pembimbing-read.repository";
import { PembimbingWriteRepository } from "../repository/pembimbing-write.repository";

export class PembimbingService {
  static async getAllPembimbings(): Promise<PembimbingResponseDto[]> {
    return PembimbingReadRepository.getAllPembimbings();
  }

  static async getPembimbingById(
    id: number,
  ): Promise<PembimbingResponseDto | null> {
    return PembimbingReadRepository.getPembimbingById(id);
  }

  static async createPembimbing(payload: CreatePembimbingRequestDto) {
    const existingPembimbing =
      await PembimbingReadRepository.getPembimbingByUniqueFields(
        payload.nidn,
        payload.email,
        payload.user_id,
      );

    if (existingPembimbing) {
      return { conflict: true as const };
    }

    const hashedPassword = await hash(payload.password, 10);
    const result = await PembimbingWriteRepository.createPembimbing({
      ...payload,
      password: hashedPassword,
    });

    return { conflict: false as const, result };
  }

  static async updatePembimbing(
    id: number,
    payload: UpdatePembimbingRequestDto,
  ) {
    const pembimbing = await PembimbingReadRepository.getPembimbingById(id);

    if (!pembimbing) {
      return null;
    }

    const updateData = { ...payload };

    if (payload.password) {
      updateData.password = await hash(payload.password, 10);
    }

    const result = await PembimbingWriteRepository.updatePembimbing(
      id,
      updateData,
    );

    if (
      "image_public_id" in payload &&
      payload.image_public_id !== pembimbing.image_public_id
    ) {
      await deleteImageFromCloudinarySafely(pembimbing.image_public_id);
    }

    return { pembimbing, result };
  }

  static async deletePembimbing(id: number) {
    const pembimbing = await PembimbingReadRepository.getPembimbingById(id);

    if (!pembimbing) {
      return null;
    }

    const result = await PembimbingWriteRepository.deletePembimbing(id);
    await deleteImageFromCloudinarySafely(pembimbing.image_public_id);

    return { pembimbing, result };
  }
}
