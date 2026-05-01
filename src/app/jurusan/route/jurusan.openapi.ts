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
import { jurusanSchema } from "../../../docs/openapi-schemas";

const jurusanIdParamsSchema = createNumericPathParamsSchema("id");

const createJurusanRequestSchema = z
  .object({
    kode: z.string().min(1).openapi({
      example: "TI",
    }),
    nama: z.string().min(1).openapi({
      example: "Teknik Informatika",
    }),
  })
  .openapi("CreateJurusanRequest");

const updateJurusanRequestSchema = z
  .object({
    kode: z.string().min(1).optional().openapi({
      example: "SI",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "Sistem Informasi",
    }),
  })
  .openapi("UpdateJurusanRequest");

const jurusanListResponseSchema = createSuccessEnvelopeSchema(
  "JurusanListResponse",
  z.array(jurusanSchema),
  "Jurusans fetched successfully",
);

const jurusanDetailResponseSchema = createSuccessEnvelopeSchema(
  "JurusanDetailResponse",
  jurusanSchema,
  "Jurusan fetched successfully",
);

const jurusanMutationResponseSchema = createSuccessEnvelopeSchema(
  "JurusanMutationResponse",
  writeResultSchema,
  "Jurusan created successfully",
);

export const getAllJurusansRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Jurusans"],
  summary: "Get all jurusans",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(jurusanListResponseSchema, "Jurusans fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getJurusanByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Jurusans"],
  summary: "Get jurusan by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: jurusanIdParamsSchema,
  },
  responses: {
    200: jsonResponse(jurusanDetailResponseSchema, "Jurusan fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid jurusan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Jurusan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createJurusanRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Jurusans"],
  summary: "Create jurusan",
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
          schema: createJurusanRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      jurusanMutationResponseSchema,
      "Jurusan created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateJurusanRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Jurusans"],
  summary: "Update jurusan",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: jurusanIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateJurusanRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      jurusanMutationResponseSchema,
      "Jurusan updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Jurusan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteJurusanRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Jurusans"],
  summary: "Delete jurusan",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: jurusanIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      jurusanMutationResponseSchema,
      "Jurusan deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid jurusan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Jurusan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
