import { Context } from "hono";
import {
  CreateKklAgtRequestDto,
  UpdateKklAgtRequestDto,
} from "../dto/kkl-agt-request.dto";
import { KklAgtService } from "../service/kkl-agt.service";

type ParsedKklAgtId =
  | { success: true; id: number }
  | { success: false; error: string };

export class KklAgtController {
  private static parseKklAgtIdParam(
    idParam: string | undefined,
  ): ParsedKklAgtId {
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
        error: "Invalid kkl agt ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const kklAgts = await KklAgtService.getAllKklAgts();

      return c.json({
        success: true,
        data: kklAgts,
        message: "KKL agts fetched successfully",
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
      const parsedId = KklAgtController.parseKklAgtIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const kklAgt = await KklAgtService.getKklAgtById(parsedId.id);

      if (!kklAgt) {
        return c.json({ success: false, message: "KKL agt not found" }, 404);
      }

      return c.json({
        success: true,
        data: kklAgt,
        message: "KKL agt fetched successfully",
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
      const body: CreateKklAgtRequestDto = await c.req.json();

      if (!body.kkl_klp_id || !body.mahasiswa_id) {
        return c.json(
          {
            success: false,
            message: "kkl_klp_id and mahasiswa_id are required",
          },
          400,
        );
      }

      const createResult = await KklAgtService.createKklAgt(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: createResult.message || "Mahasiswa already exists in this KKL klp",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "KKL agt created successfully",
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
      const parsedId = KklAgtController.parseKklAgtIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateKklAgtRequestDto = await c.req.json();
      const updateResult = await KklAgtService.updateKklAgt(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "KKL agt not found" }, 404);
      }

      if ('conflict' in updateResult && updateResult.conflict) {
        return c.json(
          {
            success: false,
            message: updateResult.message || "Conflict occurred",
          },
          400,
        );
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "KKL agt updated successfully",
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
      const parsedId = KklAgtController.parseKklAgtIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await KklAgtService.deleteKklAgt(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "KKL agt not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "KKL agt deleted successfully",
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
