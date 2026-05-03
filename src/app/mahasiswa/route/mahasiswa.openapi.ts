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
import { mahasiswaSchema } from "../../../docs/openapi-schemas";

const mahasiswaIdParamsSchema = createNumericPathParamsSchema("id");

const createMahasiswaRequestSchema = z
  .object({
    nim: z.string().min(1).openapi({
      example: "20260001",
    }),
    password: z.string().min(1).openapi({
      example: "mahasiswa123",
    }),
    nama: z.string().min(1).openapi({
      example: "Budi Santoso",
    }),
    email: z.string().email().openapi({
      example: "budi@example.com",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "081234567890",
    }),
    foto: z.string().nullable().optional().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/foto",
    }),
    jurusan_id: z.coerce.number().int().openapi({
      example: 1,
    }),
  })
  .openapi("CreateMahasiswaRequest");

const updateMahasiswaRequestSchema = z
  .object({
    nim: z.string().min(1).optional().openapi({
      example: "20260002",
    }),
    password: z.string().min(1).optional().openapi({
      example: "newpassword123",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "Budi Santoso Update",
    }),
    email: z.string().email().optional().openapi({
      example: "budi.update@example.com",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "081234567891",
    }),
    foto: z.string().nullable().optional().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/foto-update.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/foto-update",
    }),
    jurusan_id: createOptionalCoercedIntSchema(1),
  })
  .openapi("UpdateMahasiswaRequest");

const mahasiswaListResponseSchema = createSuccessEnvelopeSchema(
  "MahasiswaListResponse",
  z.array(mahasiswaSchema),
  "Mahasiswas fetched successfully",
);

const mahasiswaDetailResponseSchema = createSuccessEnvelopeSchema(
  "MahasiswaDetailResponse",
  mahasiswaSchema,
  "Mahasiswa fetched successfully",
);

const mahasiswaMutationResponseSchema = createSuccessEnvelopeSchema(
  "MahasiswaMutationResponse",
  writeResultSchema,
  "Mahasiswa created successfully",
);

export const getAllMahasiswasRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Mahasiswas"],
  summary: "Get all mahasiswas",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      mahasiswaListResponseSchema,
      "Mahasiswas fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getMahasiswaByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Mahasiswas"],
  summary: "Get mahasiswa by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: mahasiswaIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      mahasiswaDetailResponseSchema,
      "Mahasiswa fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid mahasiswa id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Mahasiswa not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createMahasiswaRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Mahasiswas"],
  summary: "Create mahasiswa",
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
          schema: createMahasiswaRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      mahasiswaMutationResponseSchema,
      "Mahasiswa created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateMahasiswaRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Mahasiswas"],
  summary: "Update mahasiswa",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: mahasiswaIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateMahasiswaRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      mahasiswaMutationResponseSchema,
      "Mahasiswa updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Mahasiswa not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteMahasiswaRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Mahasiswas"],
  summary: "Delete mahasiswa",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: mahasiswaIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      mahasiswaMutationResponseSchema,
      "Mahasiswa deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid mahasiswa id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Mahasiswa not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
