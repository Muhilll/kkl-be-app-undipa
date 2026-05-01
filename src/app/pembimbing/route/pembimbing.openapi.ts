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
import { pembimbingSchema } from "../../../docs/openapi-schemas";

const pembimbingIdParamsSchema = createNumericPathParamsSchema("id");

const createPembimbingRequestSchema = z
  .object({
    nidn: z.string().min(1).openapi({
      example: "0912345601",
    }),
    password: z.string().min(1).openapi({
      example: "pembimbing123",
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
      example: "https://res.cloudinary.com/demo/image/upload/pembimbing.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/pembimbing",
    }),
    user_id: z.coerce.number().int().openapi({
      example: 4,
    }),
  })
  .openapi("CreatePembimbingRequest");

const updatePembimbingRequestSchema = z
  .object({
    nidn: z.string().min(1).optional().openapi({
      example: "0912345602",
    }),
    password: z.string().min(1).optional().openapi({
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
      example: "https://res.cloudinary.com/demo/image/upload/pembimbing-update.jpg",
    }),
    image_public_id: z.string().nullable().optional().openapi({
      example: "uploads/pembimbing-update",
    }),
    user_id: createOptionalCoercedIntSchema(4),
  })
  .openapi("UpdatePembimbingRequest");

const pembimbingListResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingListResponse",
  z.array(pembimbingSchema),
  "Pembimbings fetched successfully",
);

const pembimbingDetailResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingDetailResponse",
  pembimbingSchema,
  "Pembimbing fetched successfully",
);

const pembimbingMutationResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingMutationResponse",
  writeResultSchema,
  "Pembimbing created successfully",
);

export const getAllPembimbingsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Pembimbings"],
  summary: "Get all pembimbings",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      pembimbingListResponseSchema,
      "Pembimbings fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getPembimbingByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Pembimbings"],
  summary: "Get pembimbing by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: pembimbingIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      pembimbingDetailResponseSchema,
      "Pembimbing fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid pembimbing id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createPembimbingRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Pembimbings"],
  summary: "Create pembimbing",
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
          schema: createPembimbingRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      pembimbingMutationResponseSchema,
      "Pembimbing created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updatePembimbingRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Pembimbings"],
  summary: "Update pembimbing",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: pembimbingIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updatePembimbingRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      pembimbingMutationResponseSchema,
      "Pembimbing updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deletePembimbingRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Pembimbings"],
  summary: "Delete pembimbing",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: pembimbingIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      pembimbingMutationResponseSchema,
      "Pembimbing deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid pembimbing id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
