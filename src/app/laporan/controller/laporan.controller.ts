import { Context } from "hono";
import {
  CreateLaporanRequestDto,
  UpdateLaporanRequestDto,
} from "../dto/laporan-request.dto";
import { LaporanService } from "../service/laporan.service";

type ParsedLaporanId =
  | { success: true; id: number }
  | { success: false; error: string };

export class LaporanController {
  private static parseLaporanIdParam(
    idParam: string | undefined,
  ): ParsedLaporanId {
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
        error: "Invalid laporan ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const laporans = await LaporanService.getAllLaporans();

      return c.json({
        success: true,
        data: laporans,
        message: "Laporans fetched successfully",
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
      const parsedId = LaporanController.parseLaporanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const laporan = await LaporanService.getLaporanById(parsedId.id);

      if (!laporan) {
        return c.json({ success: false, message: "Laporan not found" }, 404);
      }

      return c.json({
        success: true,
        data: laporan,
        message: "Laporan fetched successfully",
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

  static async getByMahasiswaId(c: Context) {
    try {
      const parsedId = LaporanController.parseLaporanIdParam(c.req.param("mahasiswaId"));
      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const laporans = await LaporanService.getLaporansByMahasiswaId(parsedId.id);

      return c.json({
        success: true,
        data: laporans,
        message: "Laporans fetched successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async checkTodayByMahasiswaId(c: Context) {
    try {
      const parsedId = LaporanController.parseLaporanIdParam(c.req.param("mahasiswaId"));
      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const isReported = await LaporanService.checkTodayLaporanByMahasiswaId(parsedId.id);

      return c.json({
        success: true,
        data: { isReported },
        message: "Today laporan checked successfully",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
        },
        500,
      );
    }
  }

  static async create(c: Context) {
    try {
      const body: CreateLaporanRequestDto = await c.req.json();

      if (!body.kkl_agt_id || !body.tanggal || !body.jam || !body.aktifitas || !body.status) {
        return c.json(
          {
            success: false,
            message: "kkl_agt_id, tanggal, jam, aktifitas, and status are required",
          },
          400,
        );
      }

      const createResult = await LaporanService.createLaporan(body);

      if ('error' in createResult) {
        return c.json(
          {
            success: false,
            message: createResult.error,
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Laporan created successfully",
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
      const parsedId = LaporanController.parseLaporanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateLaporanRequestDto = await c.req.json();
      const updateResult = await LaporanService.updateLaporan(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "Laporan not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Laporan updated successfully",
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
      const parsedId = LaporanController.parseLaporanIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await LaporanService.deleteLaporan(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Laporan not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Laporan deleted successfully",
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
