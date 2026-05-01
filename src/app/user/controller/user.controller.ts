import { Context } from "hono";
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from "../dto/user-request.dto";
import { UserService } from "../service/user.service";

type ParsedUserId =
  | { success: true; id: number }
  | { success: false; error: string };

export class UserController {
  private static parseUserIdParam(idParam: string | undefined): ParsedUserId {
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
        error: "Invalid user ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const users = await UserService.getAllUsers();

      return c.json({
        success: true,
        data: users,
        message: "Users fetched successfully",
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
      const parsedId = UserController.parseUserIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const user = await UserService.getUserById(parsedId.id);

      if (!user) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      return c.json({
        success: true,
        data: user,
        message: "User fetched successfully",
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
      const body: CreateUserRequestDto = await c.req.json();

      if (!body.email || !body.password || !body.name) {
        return c.json(
          {
            success: false,
            message: "Email, password, and name are required",
          },
          400,
        );
      }

      const createResult = await UserService.createUser(body);

      if (createResult.conflict) {
        return c.json(
          { success: false, message: "Email already registered" },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "User created successfully",
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
      const parsedId = UserController.parseUserIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateUserRequestDto = await c.req.json();
      const updateResult = await UserService.updateUser(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "User updated successfully",
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
      const parsedId = UserController.parseUserIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await UserService.deleteUser(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "User deleted successfully",
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
