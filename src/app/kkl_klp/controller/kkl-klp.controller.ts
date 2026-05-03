import { Context } from "hono";
import {
  CreateKklKlpRequestDto,
  UpdateKklKlpRequestDto,
} from "../dto/kkl-klp-request.dto";
import { KklKlpService } from "../service/kkl-klp.service";

type ParsedKklKlpId =
  | { success: true; id: number }
  | { success: false; error: string };

export class KklKlpController {
  private static parseKklKlpIdParam(
    idParam: string | undefined,
  ): ParsedKklKlpId {
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
        error: "Invalid kkl klp ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const kklKlps = await KklKlpService.getAllKklKlps();

      return c.json({
        success: true,
        data: kklKlps,
        message: "KKL klps fetched successfully",
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
      const parsedId = KklKlpController.parseKklKlpIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const kklKlp = await KklKlpService.getKklKlpById(parsedId.id);

      if (!kklKlp) {
        return c.json({ success: false, message: "KKL klp not found" }, 404);
      }

      return c.json({
        success: true,
        data: kklKlp,
        message: "KKL klp fetched successfully",
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
      const body: CreateKklKlpRequestDto = await c.req.json();

      if (!body.kkl_periode_id || !body.instansi_id || !body.dosen_id) {
        return c.json(
          {
            success: false,
            message: "kkl_periode_id, instansi_id, and dosen_id are required",
          },
          400,
        );
      }

      const createResult = await KklKlpService.createKklKlp(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message:
              "KKL klp with same periode, instansi, and dosen already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "KKL klp created successfully",
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
      const parsedId = KklKlpController.parseKklKlpIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateKklKlpRequestDto = await c.req.json();
      const updateResult = await KklKlpService.updateKklKlp(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "KKL klp not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "KKL klp updated successfully",
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
      const parsedId = KklKlpController.parseKklKlpIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await KklKlpService.deleteKklKlp(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "KKL klp not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "KKL klp deleted successfully",
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
