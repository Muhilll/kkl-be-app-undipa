import { createRoute, z } from "@hono/zod-openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";
import { requirePermission } from "../../../middleware/permission";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  createOptionalCoercedIntSchema,
  createSuccessEnvelopeSchema,
  jsonResponse,
  protectedSecurity,
  writeResultSchema,
} from "../../../docs/openapi-common";
import { kklKlpSchema } from "../../../docs/openapi-schemas";

const kklKlpIdParamsSchema = createNumericPathParamsSchema("id");

const createKklKlpRequestSchema = z
  .object({
    nama: z.string().min(1).openapi({
      example: "Kelompok 1",
    }),
    kkl_periode_id: z.coerce.number().int().openapi({
      example: 1,
    }),
    instansi_id: z.coerce.number().int().openapi({
      example: 1,
    }),
    dosen_id: z.coerce.number().int().openapi({
      example: 1,
    }),
  })
  .openapi("CreateKklKlpRequest");

const updateKklKlpRequestSchema = z
  .object({
    nama: z.string().min(1).optional().openapi({
      example: "Kelompok 1 Update",
    }),
    kkl_periode_id: createOptionalCoercedIntSchema(1),
    instansi_id: createOptionalCoercedIntSchema(1),
    dosen_id: createOptionalCoercedIntSchema(1),
  })
  .openapi("UpdateKklKlpRequest");

const kklKlpListResponseSchema = createSuccessEnvelopeSchema(
  "KklKlpListResponse",
  z.array(kklKlpSchema),
  "KKL klps fetched successfully",
);

const kklKlpDetailResponseSchema = createSuccessEnvelopeSchema(
  "KklKlpDetailResponse",
  kklKlpSchema,
  "KKL klp fetched successfully",
);

const kklKlpMutationResponseSchema = createSuccessEnvelopeSchema(
  "KklKlpMutationResponse",
  writeResultSchema,
  "KKL klp created successfully",
);

export const getAllKklKlpsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["KKL Klps"],
  summary: "Get all KKL klps",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(kklKlpListResponseSchema, "KKL klps fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getKklKlpByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["KKL Klps"],
  summary: "Get KKL klp by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklKlpIdParamsSchema,
  },
  responses: {
    200: jsonResponse(kklKlpDetailResponseSchema, "KKL klp fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL klp id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL klp not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createKklKlpRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["KKL Klps"],
  summary: "Create KKL klp",
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
          schema: createKklKlpRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(kklKlpMutationResponseSchema, "KKL klp created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateKklKlpRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["KKL Klps"],
  summary: "Update KKL klp",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklKlpIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateKklKlpRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(kklKlpMutationResponseSchema, "KKL klp updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL klp not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteKklKlpRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["KKL Klps"],
  summary: "Delete KKL klp",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklKlpIdParamsSchema,
  },
  responses: {
    200: jsonResponse(kklKlpMutationResponseSchema, "KKL klp deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL klp id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL klp not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
