import { Context } from "hono";
import {
  CreateRolePermissionRequestDto,
  UpdateRolePermissionRequestDto,
} from "../dto/role-permission-request.dto";
import { RolePermissionService } from "../service/role-permission.service";

type ParsedRolePermissionId =
  | { success: true; id: number }
  | { success: false; error: string };

type ParsedRoleId =
  | { success: true; roleId: number }
  | { success: false; error: string };

export class RolePermissionController {
  private static parseRolePermissionIdParam(
    idParam: string | undefined,
  ): ParsedRolePermissionId {
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
        error: "Invalid role permission ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  private static parseRoleIdParam(
    roleIdParam: string | undefined,
  ): ParsedRoleId {
    if (!roleIdParam) {
      return {
        success: false,
        error: "Role ID is required",
      };
    }

    const roleId = parseInt(roleIdParam, 10);

    if (isNaN(roleId)) {
      return {
        success: false,
        error: "Invalid role ID",
      };
    }

    return {
      success: true,
      roleId,
    };
  }

  static async getAll(c: Context) {
    try {
      const rolePermissions = await RolePermissionService.getAllRolePermissions();

      return c.json({
        success: true,
        data: rolePermissions,
        message: "Role permissions fetched successfully",
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
      const parsedId = RolePermissionController.parseRolePermissionIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const rolePermission = await RolePermissionService.getRolePermissionById(
        parsedId.id,
      );

      if (!rolePermission) {
        return c.json(
          { success: false, message: "Role permission not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: rolePermission,
        message: "Role permission fetched successfully",
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

  static async getByRoleId(c: Context) {
    try {
      const parsedRoleId = RolePermissionController.parseRoleIdParam(
        c.req.param("roleId"),
      );

      if (parsedRoleId.success === false) {
        return c.json({ success: false, message: parsedRoleId.error }, 400);
      }

      const permissions = await RolePermissionService.getPermissionsByRoleId(
        parsedRoleId.roleId,
      );

      return c.json({
        success: true,
        data: permissions,
        message: "Role permissions fetched successfully",
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
      const body: CreateRolePermissionRequestDto = await c.req.json();

      if (!body.role_id || !body.menu_id) {
        return c.json(
          {
            success: false,
            message: "Role ID and Menu ID are required",
          },
          400,
        );
      }

      const result = await RolePermissionService.createRolePermission(body);

      return c.json(
        {
          success: true,
          data: result,
          message: "Role permission created successfully",
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
      const parsedId = RolePermissionController.parseRolePermissionIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateRolePermissionRequestDto = await c.req.json();
      const updateResult = await RolePermissionService.updateRolePermission(
        parsedId.id,
        body,
      );

      if (!updateResult) {
        return c.json(
          { success: false, message: "Role permission not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Role permission updated successfully",
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
      const parsedId = RolePermissionController.parseRolePermissionIdParam(
        c.req.param("id"),
      );

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await RolePermissionService.deleteRolePermission(
        parsedId.id,
      );

      if (!deleteResult) {
        return c.json(
          { success: false, message: "Role permission not found" },
          404,
        );
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Role permission deleted successfully",
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
