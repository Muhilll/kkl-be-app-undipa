import { Context } from "hono";
import {
  CreateKklPeriodeRequestDto,
  UpdateKklPeriodeRequestDto,
} from "../dto/kkl-periode-request.dto";
import { KklPeriodeService } from "../service/kkl-periode.service";

type ParsedKklPeriodeId =
  | { success: true; id: number }
  | { success: false; error: string };

const validSemesters = ["ganjil", "genap"];

export class KklPeriodeController {
  private static parseKklPeriodeIdParam(
    idParam: string | undefined,
  ): ParsedKklPeriodeId {
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
        error: "Invalid kkl periode ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  private static isValidSemester(semester: string | undefined) {
    return Boolean(semester && validSemesters.includes(semester));
  }

  static async getAll(c: Context) {
    try {
      const kklPeriodes = await KklPeriodeService.getAllKklPeriodes();

      return c.json({
        success: true,
        data: kklPeriodes,
        message: "KKL periodes fetched successfully",
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
      const parsedId = KklPeriodeController.parseKklPeriodeIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const kklPeriode = await KklPeriodeService.getKklPeriodeById(
        parsedId.id,
      );

      if (!kklPeriode) {
        return c.json(
          { success: false, message: "KKL periode not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: kklPeriode,
        message: "KKL periode fetched successfully",
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
      const body: CreateKklPeriodeRequestDto = await c.req.json();

      if (
        !body.nama ||
        !body.tahun ||
        !KklPeriodeController.isValidSemester(body.semester) ||
        !body.max_agt_klp
      ) {
        return c.json(
          {
            success: false,
            message:
              "Nama, tahun, semester, and max_agt_klp are required. Semester must be ganjil or genap",
          },
          400,
        );
      }

      if (
        body.is_active !== undefined &&
        typeof body.is_active !== "boolean"
      ) {
        return c.json(
          {
            success: false,
            message: "is_active must be boolean",
          },
          400,
        );
      }

      const createResult = await KklPeriodeService.createKklPeriode(body);

      if (createResult.conflict) {
        return c.json(
          {
            success: false,
            message: "KKL periode tahun and semester already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "KKL periode created successfully",
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
      const parsedId = KklPeriodeController.parseKklPeriodeIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateKklPeriodeRequestDto = await c.req.json();

      if (
        body.semester &&
        !KklPeriodeController.isValidSemester(body.semester)
      ) {
        return c.json(
          {
            success: false,
            message: "Semester must be ganjil or genap",
          },
          400,
        );
      }

      if (
        body.is_active !== undefined &&
        typeof body.is_active !== "boolean"
      ) {
        return c.json(
          {
            success: false,
            message: "is_active must be boolean",
          },
          400,
        );
      }

      const updateResult = await KklPeriodeService.updateKklPeriode(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json(
          { success: false, message: "KKL periode not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "KKL periode updated successfully",
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

  static async activate(c: Context) {
    try {
      const parsedId = KklPeriodeController.parseKklPeriodeIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const activateResult = await KklPeriodeService.activateKklPeriode(
        parsedId.id,
      );

      if (!activateResult) {
        return c.json(
          { success: false, message: "KKL periode not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: activateResult.result,
        message: "KKL periode activated successfully",
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
      const parsedId = KklPeriodeController.parseKklPeriodeIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await KklPeriodeService.deleteKklPeriode(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json(
          { success: false, message: "KKL periode not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "KKL periode deleted successfully",
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
