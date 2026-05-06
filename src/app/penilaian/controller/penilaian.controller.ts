import { Context } from "hono";
import {
  CreatePenilaianRequestDto,
  UpdatePenilaianRequestDto,
} from "../dto/penilaian-request.dto";
import { PenilaianService } from "../service/penilaian.service";

type ParsedPenilaianId =
  | { success: true; id: number }
  | { success: false; error: string };

export class PenilaianController {
  private static parsePenilaianIdParam(
    idParam: string | undefined,
  ): ParsedPenilaianId {
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
        error: "Invalid penilaian ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const penilaians = await PenilaianService.getAllPenilaians();

      return c.json({
        success: true,
        data: penilaians,
        message: "Penilaians fetched successfully",
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
      const parsedId = PenilaianController.parsePenilaianIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const penilaian = await PenilaianService.getPenilaianById(parsedId.id);

      if (!penilaian) {
        return c.json({ success: false, message: "Penilaian not found" }, 404);
      }

      return c.json({
        success: true,
        data: penilaian,
        message: "Penilaian fetched successfully",
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
      const body: CreatePenilaianRequestDto = await c.req.json();

      // Basic validation for all required fields
      if (
        body.kkl_agt_id === undefined ||
        body.pembimbing_id === undefined ||
        body.total === undefined ||
        !body.ratarata
      ) {
        return c.json(
          {
            success: false,
            message: "Missing required fields for Penilaian",
          },
          400,
        );
      }

      const createResult = await PenilaianService.createPenilaian(body);

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Penilaian created successfully",
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
      const parsedId = PenilaianController.parsePenilaianIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdatePenilaianRequestDto = await c.req.json();
      const updateResult = await PenilaianService.updatePenilaian(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Penilaian not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Penilaian updated successfully",
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
      const parsedId = PenilaianController.parsePenilaianIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await PenilaianService.deletePenilaian(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json({ success: false, message: "Penilaian not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Penilaian deleted successfully",
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
