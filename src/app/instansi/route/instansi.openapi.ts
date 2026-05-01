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
import { instansiSchema } from "../../../docs/openapi-schemas";

const instansiIdParamsSchema = createNumericPathParamsSchema("id");
const nullableDecimalSchema = z.union([z.string(), z.number()]).nullable();

const createInstansiRequestSchema = z
  .object({
    kode: z.string().min(1).openapi({
      example: "INS001",
    }),
    nama: z.string().min(1).openapi({
      example: "PT Teknologi Nusantara",
    }),
    alamat: z.string().min(1).openapi({
      example: "Jl. Perintis Kemerdekaan No. 10, Makassar",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "0411123456",
    }),
    latitude: nullableDecimalSchema.optional().openapi({
      example: "-5.14766500",
    }),
    longitude: nullableDecimalSchema.optional().openapi({
      example: "119.43273200",
    }),
  })
  .openapi("CreateInstansiRequest");

const updateInstansiRequestSchema = z
  .object({
    kode: z.string().min(1).optional().openapi({
      example: "INS002",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "PT Teknologi Nusantara Update",
    }),
    alamat: z.string().min(1).optional().openapi({
      example: "Jl. A. P. Pettarani No. 20, Makassar",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "0411654321",
    }),
    latitude: nullableDecimalSchema.optional().openapi({
      example: "-5.15916800",
    }),
    longitude: nullableDecimalSchema.optional().openapi({
      example: "119.43628000",
    }),
  })
  .openapi("UpdateInstansiRequest");

const instansiListResponseSchema = createSuccessEnvelopeSchema(
  "InstansiListResponse",
  z.array(instansiSchema),
  "Instansis fetched successfully",
);

const instansiDetailResponseSchema = createSuccessEnvelopeSchema(
  "InstansiDetailResponse",
  instansiSchema,
  "Instansi fetched successfully",
);

const instansiMutationResponseSchema = createSuccessEnvelopeSchema(
  "InstansiMutationResponse",
  writeResultSchema,
  "Instansi created successfully",
);

export const getAllInstansisRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Instansis"],
  summary: "Get all instansis",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(instansiListResponseSchema, "Instansis fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getInstansiByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Instansis"],
  summary: "Get instansi by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiIdParamsSchema,
  },
  responses: {
    200: jsonResponse(instansiDetailResponseSchema, "Instansi fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid instansi id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createInstansiRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Instansis"],
  summary: "Create instansi",
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
          schema: createInstansiRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      instansiMutationResponseSchema,
      "Instansi created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateInstansiRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Instansis"],
  summary: "Update instansi",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateInstansiRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      instansiMutationResponseSchema,
      "Instansi updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteInstansiRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Instansis"],
  summary: "Delete instansi",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: instansiIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      instansiMutationResponseSchema,
      "Instansi deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid instansi id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Instansi not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
