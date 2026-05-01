import { Context } from "hono";
import {
  CreateInstansiRequestDto,
  UpdateInstansiRequestDto,
} from "../dto/instansi-request.dto";
import { InstansiService } from "../service/instansi.service";

type ParsedInstansiId =
  | { success: true; id: number }
  | { success: false; error: string };

export class InstansiController {
  private static parseInstansiIdParam(
    idParam: string | undefined,
  ): ParsedInstansiId {
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
        error: "Invalid instansi ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const instansis = await InstansiService.getAllInstansis();

      return c.json({
        success: true,
        data: instansis,
        message: "Instansis fetched successfully",
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
      const parsedId = InstansiController.parseInstansiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const instansi = await InstansiService.getInstansiById(parsedId.id);

      if (!instansi) {
        return c.json({ success: false, message: "Instansi not found" }, 404);
      }

      return c.json({
        success: true,
        data: instansi,
        message: "Instansi fetched successfully",
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
      const body: CreateInstansiRequestDto = await c.req.json();

      if (!body.kode || !body.nama || !body.alamat) {
        return c.json(
          {
            success: false,
            message: "Kode, nama, and alamat are required",
          },
          400,
        );
      }

      const createResult = await InstansiService.createInstansi(body);

      if (createResult.conflict) {
        return c.json(
          { success: false, message: "Instansi kode already exists" },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Instansi created successfully",
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
      const parsedId = InstansiController.parseInstansiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateInstansiRequestDto = await c.req.json();
      const updateResult = await InstansiService.updateInstansi(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Instansi not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Instansi updated successfully",
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
      const parsedId = InstansiController.parseInstansiIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await InstansiService.deleteInstansi(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Instansi not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Instansi deleted successfully",
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
