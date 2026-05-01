import { createRoute, z } from "@hono/zod-openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";
import {
  apiErrorResponseSchema,
  createCoercedIntSchema,
  createNumericPathParamsSchema,
  createOptionalCoercedIntSchema,
  createSuccessEnvelopeSchema,
  jsonResponse,
  protectedSecurity,
  writeResultSchema,
} from "../../../docs/openapi-common";
import { rolePermissionSchema } from "../../../docs/openapi-schemas";

const rolePermissionIdParamsSchema = createNumericPathParamsSchema("id");
const roleIdParamsSchema = createNumericPathParamsSchema("roleId");

const createRolePermissionRequestSchema = z
  .object({
    role_id: createCoercedIntSchema(1),
    menu_id: createCoercedIntSchema(2),
    can_read: z.boolean().optional().openapi({ example: true }),
    can_create: z.boolean().optional().openapi({ example: true }),
    can_update: z.boolean().optional().openapi({ example: true }),
    can_delete: z.boolean().optional().openapi({ example: false }),
    can_report: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("CreateRolePermissionRequest");

const updateRolePermissionRequestSchema = z
  .object({
    role_id: createOptionalCoercedIntSchema(2),
    menu_id: createOptionalCoercedIntSchema(5),
    can_read: z.boolean().optional().openapi({ example: true }),
    can_create: z.boolean().optional().openapi({ example: false }),
    can_update: z.boolean().optional().openapi({ example: false }),
    can_delete: z.boolean().optional().openapi({ example: false }),
    can_report: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("UpdateRolePermissionRequest");

const listResponseSchema = createSuccessEnvelopeSchema(
  "RolePermissionListResponse",
  z.array(rolePermissionSchema),
  "Role permissions fetched successfully",
);

const detailResponseSchema = createSuccessEnvelopeSchema(
  "RolePermissionDetailResponse",
  rolePermissionSchema,
  "Role permission fetched successfully",
);

const mutationResponseSchema = createSuccessEnvelopeSchema(
  "RolePermissionMutationResponse",
  writeResultSchema,
  "Role permission created successfully",
);

export const getAllRolePermissionsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Role Permissions"],
  summary: "Get all role permissions",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(listResponseSchema, "Role permissions fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getRolePermissionByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Get role permission by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: { params: rolePermissionIdParamsSchema },
  responses: {
    200: jsonResponse(detailResponseSchema, "Role permission fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role permission id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getRolePermissionsByRoleIdRoute = createRoute({
  method: "get",
  path: "/role/{roleId}",
  tags: ["Role Permissions"],
  summary: "Get role permissions by role id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: { params: roleIdParamsSchema },
  responses: {
    200: jsonResponse(listResponseSchema, "Role permissions fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createRolePermissionRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Role Permissions"],
  summary: "Create role permission",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: createRolePermissionRequestSchema } },
    },
  },
  responses: {
    201: jsonResponse(mutationResponseSchema, "Role permission created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateRolePermissionRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Update role permission",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: rolePermissionIdParamsSchema,
    body: {
      required: true,
      content: { "application/json": { schema: updateRolePermissionRequestSchema } },
    },
  },
  responses: {
    200: jsonResponse(mutationResponseSchema, "Role permission updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteRolePermissionRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Delete role permission",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: { params: rolePermissionIdParamsSchema },
  responses: {
    200: jsonResponse(mutationResponseSchema, "Role permission deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role permission id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
