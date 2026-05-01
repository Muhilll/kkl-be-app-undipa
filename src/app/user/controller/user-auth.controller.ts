import { Context } from "hono";
import { LoginRequestDto } from "../dto/user-request.dto";
import { UserAuthService } from "../service/user-auth.service";

export class UserAuthController {
  static async login(c: Context) {
    try {
      const body: LoginRequestDto = await c.req.json();

      if (!body.email || !body.password) {
        return c.json(
          {
            success: false,
            message: "Email and password are required",
          },
          400,
        );
      }

      const loginResult = await UserAuthService.login(body.email, body.password);

      if (!loginResult) {
        return c.json(
          { success: false, message: "Invalid email or password" },
          401,
        );
      }

      return c.json({
        success: true,
        data: loginResult,
        message: "Login successful",
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
