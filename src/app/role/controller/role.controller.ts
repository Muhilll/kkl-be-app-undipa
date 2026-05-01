import { Context } from "hono";
import {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
} from "../dto/role-request.dto";
import { RoleService } from "../service/role.service";

type ParsedRoleId =
  | { success: true; id: number }
  | { success: false; error: string };

export class RoleController {
  private static parseRoleIdParam(idParam: string | undefined): ParsedRoleId {
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
        error: "Invalid role ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const roles = await RoleService.getAllRoles();

      return c.json({
        success: true,
        data: roles,
        message: "Roles fetched successfully",
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
      const parsedId = RoleController.parseRoleIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const role = await RoleService.getRoleById(parsedId.id);

      if (!role) {
        return c.json({ success: false, message: "Role not found" }, 404);
      }

      return c.json({
        success: true,
        data: role,
        message: "Role fetched successfully",
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
      const body: CreateRoleRequestDto = await c.req.json();

      if (!body.code || !body.name) {
        return c.json(
          {
            success: false,
            message: "Code and name are required",
          },
          400,
        );
      }

      const createResult = await RoleService.createRole(body);

      if (createResult.conflict) {
        return c.json(
          { success: false, message: "Role code already exists" },
          400,
        );
      }

      return c.json(
        {
          success: true,
          data: createResult.result,
          message: "Role created successfully",
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
      const parsedId = RoleController.parseRoleIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateRoleRequestDto = await c.req.json();
      const updateResult = await RoleService.updateRole(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "Role not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Role updated successfully",
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
      const parsedId = RoleController.parseRoleIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await RoleService.deleteRole(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Role not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Role deleted successfully",
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
