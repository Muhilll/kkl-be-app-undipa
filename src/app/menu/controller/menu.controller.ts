import { Context } from "hono";
import {
  CreateMenuRequestDto,
  UpdateMenuRequestDto,
} from "../dto/menu-request.dto";
import { MenuService } from "../service/menu.service";

type ParsedMenuId =
  | { success: true; id: number }
  | { success: false; error: string };

export class MenuController {
  private static parseMenuIdParam(idParam: string | undefined): ParsedMenuId {
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
        error: "Invalid menu ID",
      };
    }

    return {
      success: true,
      id,
    };
  }

  static async getAll(c: Context) {
    try {
      const menus = await MenuService.getAllMenus();

      return c.json({
        success: true,
        data: menus,
        message: "Menus fetched successfully",
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
      const parsedId = MenuController.parseMenuIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const menu = await MenuService.getMenuById(parsedId.id);

      if (!menu) {
        return c.json({ success: false, message: "Menu not found" }, 404);
      }

      return c.json({
        success: true,
        data: menu,
        message: "Menu fetched successfully",
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
      const body: CreateMenuRequestDto = await c.req.json();

      if (!body.name || !body.path) {
        return c.json(
          {
            success: false,
            message: "Name and path are required",
          },
          400,
        );
      }

      const result = await MenuService.createMenu(body);

      return c.json(
        {
          success: true,
          data: result,
          message: "Menu created successfully",
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
      const parsedId = MenuController.parseMenuIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const body: UpdateMenuRequestDto = await c.req.json();
      const updateResult = await MenuService.updateMenu(parsedId.id, body);

      if (!updateResult) {
        return c.json({ success: false, message: "Menu not found" }, 404);
      }

      return c.json({
        success: true,
        data: updateResult.result,
        message: "Menu updated successfully",
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
      const parsedId = MenuController.parseMenuIdParam(c.req.param("id"));

      if (parsedId.success === false) {
        return c.json({ success: false, message: parsedId.error }, 400);
      }

      const deleteResult = await MenuService.deleteMenu(parsedId.id);

      if (!deleteResult) {
        return c.json({ success: false, message: "Menu not found" }, 404);
      }

      return c.json({
        success: true,
        data: deleteResult.result,
        message: "Menu deleted successfully",
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
