import { Context } from "hono";
import {
  CreatePembimbingRequestDto,
  UpdatePembimbingRequestDto,
} from "../dto/pembimbing-request.dto";
import { PembimbingService } from "../service/pembimbing.service";

type ParsedPembimbingId =
  | { success: true; id: number }
  | { success: false; error: string };

export class PembimbingController {
  private static parsePembimbingIdParam(
    idParam: string | undefined,
  ): ParsedPembimbingId {
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
        error: "Invalid pembimbing ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const pembimbings = await PembimbingService.getAllPembimbings();

      return c.json({
        success: true,
        data: pembimbings,
        message: "Pembimbings fetched successfully",
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
      const parsedId = PembimbingController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const pembimbing = await PembimbingService.getPembimbingById(parsedId.id);

      if (!pembimbing) {
        return c.json({ success: false, message: "Pembimbing not found" }, 404);
      }

      return c.json({
        success: true,
        data: pembimbing,
        message: "Pembimbing fetched successfully",
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
      const body: CreatePembimbingRequestDto = await c.req.json();

      if (
        !body.nidn ||
        !body.password ||
        !body.nama ||
        !body.email ||
        !body.user_id
      ) {
        return c.json(
          {
            success: false,
            message: "NIDN, password, nama, email, and user_id are required",
          },
          400,
        );
      }

      const createResult = await PembimbingService.createPembimbing(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: "Pembimbing NIDN, email, or user_id already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Pembimbing created successfully",
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
      const parsedId = PembimbingController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdatePembimbingRequestDto = await c.req.json();
      const updateResult = await PembimbingService.updatePembimbing(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Pembimbing not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Pembimbing updated successfully",
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
      const parsedId = PembimbingController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await PembimbingService.deletePembimbing(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json({ success: false, message: "Pembimbing not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Pembimbing deleted successfully",
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
