import { Context } from "hono";
import {
  CreateInstansiPenilaiRequestDto,
  UpdateInstansiPenilaiRequestDto,
} from "../dto/instansi-penilai-request.dto";
import { InstansiPenilaiService } from "../service/instansi-penilai.service";

type ParsedInstansiPenilaiId =
  | { success: true; id: number }
  | { success: false; error: string };

export class InstansiPenilaiController {
  private static parseInstansiPenilaiIdParam(
    idParam: string | undefined,
  ): ParsedInstansiPenilaiId {
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
        error: "Invalid instansi penilai ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const instansiPenilais = await InstansiPenilaiService.getAllInstansiPenilais();

      return c.json({
        success: true,
        data: instansiPenilais,
        message: "Instansi Penilais fetched successfully",
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
      const parsedId = InstansiPenilaiController.parseInstansiPenilaiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const instansiPenilai = await InstansiPenilaiService.getInstansiPenilaiById(parsedId.id);

      if (!instansiPenilai) {
        return c.json({ success: false, message: "Instansi Penilai not found" }, 404);
      }

      return c.json({
        success: true,
        data: instansiPenilai,
        message: "Instansi Penilai fetched successfully",
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
      const body: CreateInstansiPenilaiRequestDto = await c.req.json();

      if (
        !body.kkl_klp_id ||
        !body.virtual_account ||
        !body.password ||
        !body.nama ||
        !body.jabatan
      ) {
        return c.json(
          {
            success: false,
            message: "kkl_klp_id, virtual_account, password, nama, and jabatan are required",
          },
          400,
        );
      }

      const createResult = await InstansiPenilaiService.createInstansiPenilai(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: "Instansi Penilai virtual_account already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Instansi Penilai created successfully",
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
      const parsedId = InstansiPenilaiController.parseInstansiPenilaiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateInstansiPenilaiRequestDto = await c.req.json();
      const updateResult = await InstansiPenilaiService.updateInstansiPenilai(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Instansi Penilai not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Instansi Penilai updated successfully",
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
      const parsedId = InstansiPenilaiController.parseInstansiPenilaiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await InstansiPenilaiService.deleteInstansiPenilai(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json({ success: false, message: "Instansi Penilai not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Instansi Penilai deleted successfully",
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
