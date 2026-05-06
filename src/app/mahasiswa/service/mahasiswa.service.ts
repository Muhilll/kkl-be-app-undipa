import { hash } from "bcryptjs";
import { deleteImageFromCloudinarySafely } from "../../../utils/cloudinary";
import {
  CreateMahasiswaRequestDto,
  UpdateMahasiswaRequestDto,
} from "../dto/mahasiswa-request.dto";
import { MahasiswaResponseDto } from "../dto/mahasiswa-response.dto";
import { MahasiswaReadRepository } from "../repository/mahasiswa-read.repository";
import { MahasiswaWriteRepository } from "../repository/mahasiswa-write.repository";

export class MahasiswaService {
  static async getAllMahasiswas(): Promise<MahasiswaResponseDto[]> {
    return MahasiswaReadRepository.getAllMahasiswas();
  }

  static async getMahasiswaById(
    id: number,
  ): Promise<MahasiswaResponseDto | null> {
    return MahasiswaReadRepository.getMahasiswaById(id);
  }

  static async getMahasiswaByUserId(
    userId: number,
  ): Promise<MahasiswaResponseDto | null> {
    return MahasiswaReadRepository.getMahasiswaByUserId(userId);
  }

  static async createMahasiswa(payload: CreateMahasiswaRequestDto) {
    const existingMahasiswa = await MahasiswaReadRepository.getMahasiswaByUniqueFields(
        payload.nim,
        payload.email,
      );

    if (existingMahasiswa) {
      return { conflict: true as const };
    }

    const hashedPassword = await hash(payload.password, 10);
    const result = await MahasiswaWriteRepository.createMahasiswa({
      ...payload,
      password: hashedPassword,
    });

    return { conflict: false as const, result };
  }

  static async updateMahasiswa(id: number, payload: UpdateMahasiswaRequestDto) {
    const mahasiswa = await MahasiswaReadRepository.getMahasiswaById(id);

    if (!mahasiswa) {
      return null;
    }

    const updateData = { ...payload };

    if (payload.password && payload.password.trim() !== "") {
      updateData.password = await hash(payload.password, 10);
    } else {
      delete updateData.password;
    }

    const result = await MahasiswaWriteRepository.updateMahasiswa(
      id,
      updateData,
    );

    if (
      "image_public_id" in payload &&
      payload.image_public_id !== mahasiswa.image_public_id
    ) {
      await deleteImageFromCloudinarySafely(mahasiswa.image_public_id);
    }

    return { mahasiswa, result };
  }

  static async deleteMahasiswa(id: number) {
    const mahasiswa = await MahasiswaReadRepository.getMahasiswaById(id);

    if (!mahasiswa) {
      return null;
    }

    const result = await MahasiswaWriteRepository.deleteMahasiswa(id);
    await deleteImageFromCloudinarySafely(mahasiswa.image_public_id);

    return { mahasiswa, result };
  }
}
