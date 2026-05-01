import { Context } from "hono";
import {
  CreateJurusanRequestDto,
  UpdateJurusanRequestDto,
} from "../dto/jurusan-request.dto";
import { JurusanService } from "../service/jurusan.service";

type ParsedJurusanId =
  | { success: true; id: number }
  | { success: false; error: string };

export class JurusanController {
  private static parseJurusanIdParam(
    idParam: string | undefined,
  ): ParsedJurusanId {
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
        error: "Invalid jurusan ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const jurusans = await JurusanService.getAllJurusans();

      return c.json({
        success: true,
        data: jurusans,
        message: "Jurusans fetched successfully",
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
      const parsedId = JurusanController.parseJurusanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const jurusan = await JurusanService.getJurusanById(parsedId.id);

      if (!jurusan) {
        return c.json({ success: false, message: "Jurusan not found" }, 404);
      }

      return c.json({
        success: true,
        data: jurusan,
        message: "Jurusan fetched successfully",
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
      const body: CreateJurusanRequestDto = await c.req.json();

      if (!body.kode || !body.nama) {
        return c.json(
          {
            success: false,
            message: "Kode and nama are required",
          },
          400,
        );
      }

      const createResult = await JurusanService.createJurusan(body);

      if (createResult.conflict) {
        return c.json(
          { success: false, message: "Jurusan kode already exists" },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Jurusan created successfully",
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
      const parsedId = JurusanController.parseJurusanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateJurusanRequestDto = await c.req.json();
      const updateResult = await JurusanService.updateJurusan(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Jurusan not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Jurusan updated successfully",
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
      const parsedId = JurusanController.parseJurusanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await JurusanService.deleteJurusan(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Jurusan not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Jurusan deleted successfully",
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
