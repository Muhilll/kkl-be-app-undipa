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
import { laporanSchema } from "../../../docs/openapi-schemas";

const laporanIdParamsSchema = createNumericPathParamsSchema("id");

const createLaporanRequestSchema = z
  .object({
    kkl_agt_id: z.coerce.number().int().openapi({ example: 1 }),
    tanggal: z.string().openapi({ example: "2026-05-01" }),
    jam: z.string().openapi({ example: "08:00-16:00" }),
    aktifitas: z.string().openapi({ example: "Kegiatan observasi lapangan" }),
    file: z.string().nullable().optional().openapi({ example: null }),
    file_public_id: z.string().nullable().optional().openapi({ example: null }),
    latitude: z.string().nullable().optional().openapi({ example: "-5.14766500" }),
    longitude: z.string().nullable().optional().openapi({ example: "119.43273200" }),
    jarak: z.string().nullable().optional().openapi({ example: "0.50" }),
    status: z.enum(["valid", "invalid"]).optional().nullable().openapi({ example: "valid" }),
  })
  .openapi("CreateLaporanRequest");

const updateLaporanRequestSchema = z
  .object({
    kkl_agt_id: createOptionalCoercedIntSchema(1),
    tanggal: z.string().optional().openapi({ example: "2026-05-01" }),
    jam: z.string().optional().openapi({ example: "08:00-16:00" }),
    aktifitas: z.string().optional().openapi({ example: "Kegiatan observasi lapangan" }),
    file: z.string().nullable().optional().openapi({ example: null }),
    file_public_id: z.string().nullable().optional().openapi({ example: null }),
    latitude: z.string().nullable().optional().openapi({ example: "-5.14766500" }),
    longitude: z.string().nullable().optional().openapi({ example: "119.43273200" }),
    jarak: z.string().nullable().optional().openapi({ example: "0.50" }),
    status: z.enum(["valid", "invalid"]).optional().openapi({ example: "valid" }),
  })
  .openapi("UpdateLaporanRequest");

const laporanListResponseSchema = createSuccessEnvelopeSchema(
  "LaporanListResponse",
  z.array(laporanSchema),
  "Laporans fetched successfully",
);

const laporanDetailResponseSchema = createSuccessEnvelopeSchema(
  "LaporanDetailResponse",
  laporanSchema,
  "Laporan fetched successfully",
);

const laporanMutationResponseSchema = createSuccessEnvelopeSchema(
  "LaporanMutationResponse",
  writeResultSchema,
  "Laporan created successfully",
);

export const getAllLaporansRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Laporans"],
  summary: "Get all laporans",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(laporanListResponseSchema, "Laporans fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getLaporanByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Laporans"],
  summary: "Get laporan by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: laporanIdParamsSchema,
  },
  responses: {
    200: jsonResponse(laporanDetailResponseSchema, "Laporan fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid laporan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Laporan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getLaporansByMahasiswaIdRoute = createRoute({
  method: "get",
  path: "/by-mahasiswa/{mahasiswaId}",
  tags: ["Laporans"],
  summary: "Get laporans by mahasiswa id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
  ] as const,
  request: {
    params: createNumericPathParamsSchema("mahasiswaId"),
  },
  responses: {
    200: jsonResponse(laporanListResponseSchema, "Laporans fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid mahasiswa id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const checkTodayLaporanByMahasiswaIdRoute = createRoute({
  method: "get",
  path: "/check-today/{mahasiswaId}",
  tags: ["Laporans"],
  summary: "Check if mahasiswa has reported today",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
  ] as const,
  request: {
    params: createNumericPathParamsSchema("mahasiswaId"),
  },
  responses: {
    200: jsonResponse(createSuccessEnvelopeSchema("CheckTodayResponse", z.object({ isReported: z.boolean() }), "Today laporan checked successfully"), "Today laporan checked successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid mahasiswa id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createLaporanRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Laporans"],
  summary: "Create laporan",
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
          schema: createLaporanRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(laporanMutationResponseSchema, "Laporan created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateLaporanRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Laporans"],
  summary: "Update laporan",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: laporanIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateLaporanRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(laporanMutationResponseSchema, "Laporan updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Laporan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteLaporanRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Laporans"],
  summary: "Delete laporan",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: laporanIdParamsSchema,
  },
  responses: {
    200: jsonResponse(laporanMutationResponseSchema, "Laporan deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid laporan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Laporan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
