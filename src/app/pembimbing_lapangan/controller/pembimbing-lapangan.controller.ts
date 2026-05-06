import { Context } from "hono";
import {
  CreatePembimbingLapanganRequestDto,
  UpdatePembimbingLapanganRequestDto,
} from "../dto/pembimbing-lapangan-request.dto";
import { PembimbingLapanganService } from "../service/pembimbing-lapangan.service";

type ParsedPembimbingId =
  | { success: true; id: number }
  | { success: false; error: string };

export class PembimbingLapanganController {
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
        error: "Invalid pembimbing lapangan ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const pembimbings = await PembimbingLapanganService.getAllPembimbings();

      return c.json({
        success: true,
        data: pembimbings,
        message: "Pembimbing Lapangan fetched successfully",
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
      const parsedId = PembimbingLapanganController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const pembimbing = await PembimbingLapanganService.getPembimbingById(parsedId.id);

      if (!pembimbing) {
        return c.json({ success: false, message: "Pembimbing Lapangan not found" }, 404);
      }

      return c.json({
        success: true,
        data: pembimbing,
        message: "Pembimbing Lapangan fetched successfully",
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
      const body: CreatePembimbingLapanganRequestDto = await c.req.json();

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

      const createResult = await PembimbingLapanganService.createPembimbing(body);

      if ("conflict" in createResult && createResult.conflict) {
        return c.json(
          {
            success: false,
            message: createResult.reason === "kkl_klp_id" 
              ? "Kelompok KKL ini sudah memiliki akun Pembimbing Lapangan"
              : "Pembimbing Lapangan virtual_account already exists",
          },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Pembimbing Lapangan created successfully",
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
      const parsedId = PembimbingLapanganController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdatePembimbingLapanganRequestDto = await c.req.json();
      const updateResult = await PembimbingLapanganService.updatePembimbing(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json({ success: false, message: "Pembimbing Lapangan not found" }, 404);
      }

      if ("conflict" in updateResult && updateResult.conflict) {
        return c.json(
          {
            success: false,
            message: "Kelompok KKL ini sudah memiliki akun Pembimbing Lapangan",
          },
          400,
        );
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Pembimbing Lapangan updated successfully",
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
      const parsedId = PembimbingLapanganController.parsePembimbingIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await PembimbingLapanganService.deletePembimbing(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json({ success: false, message: "Pembimbing Lapangan not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Pembimbing Lapangan deleted successfully",
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
