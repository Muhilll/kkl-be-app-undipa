import { createRoute, z } from "@hono/zod-openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  createNullableOptionalCoercedIntSchema,
  createSuccessEnvelopeSchema,
  jsonResponse,
  protectedSecurity,
  writeResultSchema,
} from "../../../docs/openapi-common";
import { menuSchema } from "../../../docs/openapi-schemas";

const menuIdParamsSchema = createNumericPathParamsSchema("id");

const createMenuRequestSchema = z
  .object({
    name: z.string().min(1).openapi({
      example: "Reports",
    }),
    path: z.string().nullable().optional().openapi({
      example: "/reports",
    }),
    permission_path: z.string().nullable().optional().openapi({
      example: "/api/reports",
    }),
    icon: z.string().nullable().optional().openapi({
      example: "ph-chart-bar",
    }),
    parent_id: createNullableOptionalCoercedIntSchema(null),
  })
  .openapi("CreateMenuRequest");

const updateMenuRequestSchema = z
  .object({
    name: z.string().min(1).optional().openapi({
      example: "Report Detail",
    }),
    path: z.string().nullable().optional().openapi({
      example: "/reports/detail",
    }),
    permission_path: z.string().nullable().optional().openapi({
      example: "/api/reports",
    }),
    icon: z.string().nullable().optional().openapi({
      example: "ph-list",
    }),
    parent_id: createNullableOptionalCoercedIntSchema(2),
  })
  .openapi("UpdateMenuRequest");

const menuListResponseSchema = createSuccessEnvelopeSchema(
  "MenuListResponse",
  z.array(menuSchema),
  "Menus fetched successfully",
);

const menuDetailResponseSchema = createSuccessEnvelopeSchema(
  "MenuDetailResponse",
  menuSchema,
  "Menu fetched successfully",
);

const menuMutationResponseSchema = createSuccessEnvelopeSchema(
  "MenuMutationResponse",
  writeResultSchema,
  "Menu created successfully",
);

export const getAllMenusRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Menus"],
  summary: "Get all menus",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(menuListResponseSchema, "Menus fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getMenuByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Menus"],
  summary: "Get menu by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: menuIdParamsSchema,
  },
  responses: {
    200: jsonResponse(menuDetailResponseSchema, "Menu fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid menu id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Menu not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createMenuRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Menus"],
  summary: "Create menu",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMenuRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(menuMutationResponseSchema, "Menu created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateMenuRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Menus"],
  summary: "Update menu",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: menuIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateMenuRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(menuMutationResponseSchema, "Menu updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Menu not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteMenuRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Menus"],
  summary: "Delete menu",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: menuIdParamsSchema,
  },
  responses: {
    200: jsonResponse(menuMutationResponseSchema, "Menu deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid menu id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Menu not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
