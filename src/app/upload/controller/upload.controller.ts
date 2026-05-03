import { Context } from "hono";
import { createSignedUploadParams } from "../../../utils/cloudinary";

export class UploadController {
  static async createSignature(c: Context) {
    try {
      const body = await c.req.json().catch(() => ({}));
      const target = body.target;

      const signedParams = createSignedUploadParams(target);

      return c.json({
        success: true,
        data: signedParams,
        message: "Upload signature created successfully",
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
