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
import { dosenSchema } from "../../../docs/openapi-schemas";

const dosenIdParamsSchema = createNumericPathParamsSchema("id");

const createDosenRequestSchema = z
  .object({
    nidn: z.string().min(1).openapi({
      example: "0912345601",
    }),
    password: z.string().min(1).openapi({
      example: "dosen123",
    }),
    nama: z.string().min(1).openapi({
      example: "Dr. Andi Wijaya",
    }),
    email: z.string().email().openapi({
      example: "andi@example.com",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "081234567890",
    }),
    foto: z.string().nullable().optional().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/dosen.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/dosen",
    }),
  })
  .openapi("CreateDosenRequest");

const updateDosenRequestSchema = z
  .object({
    nidn: z.string().min(1).optional().openapi({
      example: "0912345602",
    }),
    password: z.string().optional().openapi({
      example: "newpassword123",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "Dr. Andi Wijaya Update",
    }),
    email: z.string().email().optional().openapi({
      example: "andi.update@example.com",
    }),
    telp: z.string().nullable().optional().openapi({
      example: "081234567891",
    }),
    foto: z.string().nullable().optional().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/dosen-update.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/dosen-update",
    }),
  })
  .openapi("UpdateDosenRequest");

const dosenListResponseSchema = createSuccessEnvelopeSchema(
  "DosenListResponse",
  z.array(dosenSchema),
  "Dosens fetched successfully",
);

const dosenDetailResponseSchema = createSuccessEnvelopeSchema(
  "DosenDetailResponse",
  dosenSchema,
  "Dosen fetched successfully",
);

const dosenMutationResponseSchema = createSuccessEnvelopeSchema(
  "DosenMutationResponse",
  writeResultSchema,
  "Dosen created successfully",
);

export const getAllDosensRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Dosens"],
  summary: "Get all dosens",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      dosenListResponseSchema,
      "Dosens fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getDosenByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Dosens"],
  summary: "Get dosen by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: dosenIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      dosenDetailResponseSchema,
      "Dosen fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dosen id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Dosen not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createDosenRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Dosens"],
  summary: "Create dosen",
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
          schema: createDosenRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      dosenMutationResponseSchema,
      "Dosen created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateDosenRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Dosens"],
  summary: "Update dosen",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: dosenIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDosenRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      dosenMutationResponseSchema,
      "Dosen updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Dosen not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteDosenRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Dosens"],
  summary: "Delete dosen",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: dosenIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      dosenMutationResponseSchema,
      "Dosen deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dosen id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Dosen not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
