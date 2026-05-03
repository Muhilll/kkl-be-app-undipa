import { Context } from "hono";
import {
  CreateDosenRequestDto,
  UpdateDosenRequestDto,
} from "../dto/dosen-request.dto";
import { DosenService } from "../service/dosen.service";

type ParsedDosenId =
  | { success: true; id: number }
  | { success: false; error: string };

export class DosenController {
  private static parseDosenIdParam(
    idParam: string | undefined,
  ): ParsedDosenId {
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
        error: "Invalid dosen ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const dosens = await DosenService.getAllDosens();

      return c.json({
        success: true,
        data: dosens,
        message: "Dosens fetched successfully",
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
      const parsedId = DosenController.parseDosenIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const dosen = await DosenService.getDosenById(parsedId.id);

      if (!dosen) {
        return c.json({ success: false, message: "Dosen not found" }, 404);
      }

      return c.json({
        success: true,
        data: dosen,
        message: "Dosen fetched successfully",
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
      const body: CreateDosenRequestDto = await c.req.json();

      if (
        !body.nidn ||
        !body.password ||
        !body.nama ||
        !body.email
      ) {
        return c.json(
          {
            success: false,
            message: "NIDN, password, nama, and email are required",
          },
          400,
        );
      }

      const createResult = await DosenService.createDosen(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: "Dosen NIDN, email, or user_id already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Dosen created successfully",
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
      const parsedId = DosenController.parseDosenIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateDosenRequestDto = await c.req.json();
      const updateResult = await DosenService.updateDosen(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Dosen not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Dosen updated successfully",
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
      const parsedId = DosenController.parseDosenIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await DosenService.deleteDosen(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json({ success: false, message: "Dosen not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Dosen deleted successfully",
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
