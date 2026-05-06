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
import { pembimbingLapanganSchema } from "../../../docs/openapi-schemas";

const pembimbingIdParamsSchema = createNumericPathParamsSchema("id");

const createPembimbingRequestSchema = z
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
  .openapi("CreatePembimbingLapanganRequest");

const updatePembimbingRequestSchema = z
  .object({
    kkl_klp_id: createOptionalCoercedIntSchema(1),
    virtual_account: z.string().min(1).optional().openapi({
      example: "VA123456789",
    }),
    password: z.string().optional().openapi({
      example: "newpassword123",
    }),
    nama: z.string().min(1).optional().openapi({
      example: "Bapak Budi Update",
    }),
    jabatan: z.string().min(1).optional().openapi({
      example: "General Manager",
    }),
  })
  .openapi("UpdatePembimbingLapanganRequest");

const pembimbingListResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingLapanganListResponse",
  z.array(pembimbingLapanganSchema),
  "Pembimbing Lapangan fetched successfully",
);

const pembimbingDetailResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingLapanganDetailResponse",
  pembimbingLapanganSchema,
  "Pembimbing Lapangan fetched successfully",
);

const pembimbingMutationResponseSchema = createSuccessEnvelopeSchema(
  "PembimbingLapanganMutationResponse",
  writeResultSchema,
  "Pembimbing Lapangan created successfully",
);

export const getAllPembimbingsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["PembimbingLapangan"],
  summary: "Get all pembimbing lapangan",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      pembimbingListResponseSchema,
      "Pembimbing Lapangan fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getPembimbingByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["PembimbingLapangan"],
  summary: "Get pembimbing lapangan by id",
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
      "Pembimbing Lapangan fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid pembimbing lapangan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing Lapangan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createPembimbingRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["PembimbingLapangan"],
  summary: "Create pembimbing lapangan",
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
      "Pembimbing Lapangan created successfully",
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
  tags: ["PembimbingLapangan"],
  summary: "Update pembimbing lapangan",
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
      "Pembimbing Lapangan updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing Lapangan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deletePembimbingRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["PembimbingLapangan"],
  summary: "Delete pembimbing lapangan",
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
      "Pembimbing Lapangan deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid pembimbing lapangan id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Pembimbing Lapangan not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
