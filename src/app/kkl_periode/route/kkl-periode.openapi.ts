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
import { kklPeriodeSchema } from "../../../docs/openapi-schemas";

const kklPeriodeIdParamsSchema = createNumericPathParamsSchema("id");
const semesterSchema = z.enum(["ganjil", "genap"]);

const createKklPeriodeRequestSchema = z
  .object({
    nama: z.string().min(1).openapi({
      example: "KKL 2026 Ganjil",
    }),
    tahun: z.string().min(1).openapi({
      example: "2026",
    }),
    semester: semesterSchema.openapi({
      example: "ganjil",
    }),
    max_agt_klp: z.coerce.number().int().openapi({
      example: 5,
    }),
  })
  .openapi("CreateKklPeriodeRequest");

const updateKklPeriodeRequestSchema = z
  .object({
    nama: z.string().min(1).optional().openapi({
      example: "KKL 2026 Genap",
    }),
    tahun: z.string().min(1).optional().openapi({
      example: "2026",
    }),
    semester: semesterSchema.optional().openapi({
      example: "genap",
    }),
    max_agt_klp: createOptionalCoercedIntSchema(6),
  })
  .openapi("UpdateKklPeriodeRequest");

const kklPeriodeListResponseSchema = createSuccessEnvelopeSchema(
  "KklPeriodeListResponse",
  z.array(kklPeriodeSchema),
  "KKL periodes fetched successfully",
);

const kklPeriodeDetailResponseSchema = createSuccessEnvelopeSchema(
  "KklPeriodeDetailResponse",
  kklPeriodeSchema,
  "KKL periode fetched successfully",
);

const kklPeriodeMutationResponseSchema = createSuccessEnvelopeSchema(
  "KklPeriodeMutationResponse",
  writeResultSchema,
  "KKL periode created successfully",
);

export const getAllKklPeriodesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["KKL Periodes"],
  summary: "Get all KKL periodes",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      kklPeriodeListResponseSchema,
      "KKL periodes fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getKklPeriodeByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["KKL Periodes"],
  summary: "Get KKL periode by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklPeriodeIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      kklPeriodeDetailResponseSchema,
      "KKL periode fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL periode id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL periode not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createKklPeriodeRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["KKL Periodes"],
  summary: "Create KKL periode",
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
          schema: createKklPeriodeRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      kklPeriodeMutationResponseSchema,
      "KKL periode created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateKklPeriodeRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["KKL Periodes"],
  summary: "Update KKL periode",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklPeriodeIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateKklPeriodeRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      kklPeriodeMutationResponseSchema,
      "KKL periode updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL periode not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteKklPeriodeRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["KKL Periodes"],
  summary: "Delete KKL periode",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklPeriodeIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      kklPeriodeMutationResponseSchema,
      "KKL periode deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL periode id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL periode not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
