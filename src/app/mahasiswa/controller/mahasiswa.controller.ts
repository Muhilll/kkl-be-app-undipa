import { Context } from "hono";
import {
  CreateMahasiswaRequestDto,
  UpdateMahasiswaRequestDto,
} from "../dto/mahasiswa-request.dto";
import { MahasiswaService } from "../service/mahasiswa.service";

type ParsedMahasiswaId =
  | { success: true; id: number }
  | { success: false; error: string };

export class MahasiswaController {
  private static parseMahasiswaIdParam(
    idParam: string | undefined,
  ): ParsedMahasiswaId {
    if (!idParam) {
      return {
        success: false,
        error: "ID is required",
      };
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return {
        success: false,
        error: "Invalid mahasiswa ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const mahasiswas = await MahasiswaService.getAllMahasiswas();

      return c.json({
        success: true,
        data: mahasiswas,
        message: "Mahasiswas fetched successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async getById(c: Context) {
    try {
      const parsedId = MahasiswaController.parseMahasiswaIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const mahasiswa = await MahasiswaService.getMahasiswaById(parsedId.id);

      if (!mahasiswa) {
        return c.json({ success: false, message: "Mahasiswa not found" }, 404);
      }

      return c.json({
        success: true,
        data: mahasiswa,
        message: "Mahasiswa fetched successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async create(c: Context) {
    try {
      const body: CreateMahasiswaRequestDto = await c.req.json();

      if (
        !body.nim ||
        !body.password ||
        !body.nama ||
        !body.email ||
        !body.jurusan_id ||
        !body.user_id
      ) {
        return c.json(
          {
            success: false,
            message:
              "NIM, password, nama, email, jurusan_id, and user_id are required",
          },
          400,
        );
      }

      const createResult = await MahasiswaService.createMahasiswa(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: "Mahasiswa NIM, email, or user_id already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Mahasiswa created successfully",
        },
        201,
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async update(c: Context) {
    try {
      const parsedId = MahasiswaController.parseMahasiswaIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateMahasiswaRequestDto = await c.req.json();
      const updateResult = await MahasiswaService.updateMahasiswa(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Mahasiswa not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Mahasiswa updated successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async delete(c: Context) {
    try {
      const parsedId = MahasiswaController.parseMahasiswaIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await MahasiswaService.deleteMahasiswa(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Mahasiswa not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Mahasiswa deleted successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }
}
