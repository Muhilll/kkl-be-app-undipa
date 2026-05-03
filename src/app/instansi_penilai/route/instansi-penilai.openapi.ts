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
import { instansiPenilaiSchema } from "../../../docs/openapi-schemas";

const instansiPenilaiIdParamsSchema = createNumericPathParamsSchema("id");

const createInstansiPenilaiRequestSchema = z
  .object({
    kkl_klp_id: z.coerce.number().int().openapi({
      example: 1,
    }),
    virtual_account: z.string().min(1).openapi({
      example: "VA123456789",
    }),
    password: z.string().min(1).openapi({
      example: "password123",
    }),
    nama: z.string().min(1).openapi({
      example: "Bapak Budi",
    }),
    jabatan: z.string().min(1).openapi({
      example: "Manager HRD",
    }),
  })
  .openapi("CreateInstansiPenilaiRequest");

const updateInstansiPenilaiRequestSchema = z
  .object({
    kkl_klp_id: createOptionalCoercedIntSchema(1),
    virtual_account: z.string().min(1).optional().openapi({
      example: "VA123456789",
    }),
    password: z.string().min(1).optional().openapi({
      example: "newpassword123",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "Bapak Budi Update",
    }),
    jabatan: z.string().min(1).optional().openapi({
      example: "General Manager",
    }),
  })
  .openapi("UpdateInstansiPenilaiRequest");

const instansiPenilaiListResponseSchema = createSuccessEnvelopeSchema(
  "InstansiPenilaiListResponse",
  z.array(instansiPenilaiSchema),
  "Instansi Penilais fetched successfully",
);

const instansiPenilaiDetailResponseSchema = createSuccessEnvelopeSchema(
  "InstansiPenilaiDetailResponse",
  instansiPenilaiSchema,
  "Instansi Penilai fetched successfully",
);

const instansiPenilaiMutationResponseSchema = createSuccessEnvelopeSchema(
  "InstansiPenilaiMutationResponse",
  writeResultSchema,
  "Instansi Penilai created successfully",
);

export const getAllInstansiPenilaisRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["InstansiPenilais"],
  summary: "Get all instansi penilais",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      instansiPenilaiListResponseSchema,
      "Instansi Penilais fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getInstansiPenilaiByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["InstansiPenilais"],
  summary: "Get instansi penilai by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiPenilaiIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      instansiPenilaiDetailResponseSchema,
      "Instansi Penilai fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid instansi penilai id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi Penilai not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createInstansiPenilaiRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["InstansiPenilais"],
  summary: "Create instansi penilai",
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
          schema: createInstansiPenilaiRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      instansiPenilaiMutationResponseSchema,
      "Instansi Penilai created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateInstansiPenilaiRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["InstansiPenilais"],
  summary: "Update instansi penilai",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiPenilaiIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateInstansiPenilaiRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      instansiPenilaiMutationResponseSchema,
      "Instansi Penilai updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi Penilai not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteInstansiPenilaiRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["InstansiPenilais"],
  summary: "Delete instansi penilai",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiPenilaiIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      instansiPenilaiMutationResponseSchema,
      "Instansi Penilai deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid instansi penilai id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi Penilai not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
