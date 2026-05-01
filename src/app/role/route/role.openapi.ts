import { createRoute, z } from "@hono/zod-openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  createSuccessEnvelopeSchema,
  jsonResponse,
  protectedSecurity,
  writeResultSchema,
} from "../../../docs/openapi-common";
import { roleSchema } from "../../../docs/openapi-schemas";

const roleIdParamsSchema = createNumericPathParamsSchema("id");

const createRoleRequestSchema = z
  .object({
    code: z.string().min(1).openapi({
      example: "SUPERVISOR",
    }),
    name: z.string().min(1).openapi({
      example: "Supervisor",
    }),
  })
  .openapi("CreateRoleRequest");

const updateRoleRequestSchema = z
  .object({
    code: z.string().min(1).optional().openapi({
      example: "SUPERVISOR",
    }),
    name: z.string().min(1).optional().openapi({
      example: "Supervisor Area",
    }),
  })
  .openapi("UpdateRoleRequest");

const roleListResponseSchema = createSuccessEnvelopeSchema(
  "RoleListResponse",
  z.array(roleSchema),
  "Roles fetched successfully",
);

const roleDetailResponseSchema = createSuccessEnvelopeSchema(
  "RoleDetailResponse",
  roleSchema,
  "Role fetched successfully",
);

const roleMutationResponseSchema = createSuccessEnvelopeSchema(
  "RoleMutationResponse",
  writeResultSchema,
  "Role created successfully",
);

export const getAllRolesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Roles"],
  summary: "Get all roles",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(roleListResponseSchema, "Roles fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getRoleByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Roles"],
  summary: "Get role by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: roleIdParamsSchema,
  },
  responses: {
    200: jsonResponse(roleDetailResponseSchema, "Role fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createRoleRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Roles"],
  summary: "Create role",
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
          schema: createRoleRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(roleMutationResponseSchema, "Role created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateRoleRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Roles"],
  summary: "Update role",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: roleIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateRoleRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(roleMutationResponseSchema, "Role updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteRoleRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Roles"],
  summary: "Delete role",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: roleIdParamsSchema,
  },
  responses: {
    200: jsonResponse(roleMutationResponseSchema, "Role deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Role not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
