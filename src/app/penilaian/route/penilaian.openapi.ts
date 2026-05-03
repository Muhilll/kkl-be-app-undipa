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
import { penilaianSchema } from "../../../docs/openapi-schemas";

const penilaianIdParamsSchema = createNumericPathParamsSchema("id");

const createPenilaianRequestSchema = z
  .object({
    kkl_agt_id: z.coerce.number().int().openapi({ example: 1 }),
    instansi_penilai_id: z.coerce.number().int().openapi({ example: 1 }),
    lama_praktek: z.coerce.number().int().openapi({ example: 85 }),
    kehadiran: z.coerce.number().int().openapi({ example: 90 }),
    disiplin: z.coerce.number().int().openapi({ example: 85 }),
    kejujuran: z.coerce.number().int().openapi({ example: 95 }),
    kerajinan: z.coerce.number().int().openapi({ example: 80 }),
    kerja_sama: z.coerce.number().int().openapi({ example: 85 }),
    sikap: z.coerce.number().int().openapi({ example: 90 }),
    inisiatif: z.coerce.number().int().openapi({ example: 80 }),
    tanggung_jawab: z.coerce.number().int().openapi({ example: 85 }),
    komunikasi: z.coerce.number().int().openapi({ example: 85 }),
    kebersihan: z.coerce.number().int().openapi({ example: 90 }),
    penampilan: z.coerce.number().int().openapi({ example: 90 }),
    kecakapan: z.coerce.number().int().openapi({ example: 85 }),
    total: z.coerce.number().int().openapi({ example: 1225 }),
    ratarata: z.string().openapi({ example: "87.50" }),
  })
  .openapi("CreatePenilaianRequest");

const updatePenilaianRequestSchema = z
  .object({
    kkl_agt_id: createOptionalCoercedIntSchema(1),
    instansi_penilai_id: createOptionalCoercedIntSchema(1),
    lama_praktek: createOptionalCoercedIntSchema(85),
    kehadiran: createOptionalCoercedIntSchema(90),
    disiplin: createOptionalCoercedIntSchema(85),
    kejujuran: createOptionalCoercedIntSchema(95),
    kerajinan: createOptionalCoercedIntSchema(80),
    kerja_sama: createOptionalCoercedIntSchema(85),
    sikap: createOptionalCoercedIntSchema(90),
    inisiatif: createOptionalCoercedIntSchema(80),
    tanggung_jawab: createOptionalCoercedIntSchema(85),
    komunikasi: createOptionalCoercedIntSchema(85),
    kebersihan: createOptionalCoercedIntSchema(90),
    penampilan: createOptionalCoercedIntSchema(90),
    kecakapan: createOptionalCoercedIntSchema(85),
    total: createOptionalCoercedIntSchema(1225),
    ratarata: z.string().optional().openapi({ example: "87.50" }),
  })
  .openapi("UpdatePenilaianRequest");

const penilaianListResponseSchema = createSuccessEnvelopeSchema(
  "PenilaianListResponse",
  z.array(penilaianSchema),
  "Penilaians fetched successfully",
);

const penilaianDetailResponseSchema = createSuccessEnvelopeSchema(
  "PenilaianDetailResponse",
  penilaianSchema,
  "Penilaian fetched successfully",
);

const penilaianMutationResponseSchema = createSuccessEnvelopeSchema(
  "PenilaianMutationResponse",
  writeResultSchema,
  "Penilaian created successfully",
);

export const getAllPenilaiansRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Penilaians"],
  summary: "Get all penilaians",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(
      penilaianListResponseSchema,
      "Penilaians fetched successfully",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getPenilaianByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Penilaians"],
  summary: "Get penilaian by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: penilaianIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      penilaianDetailResponseSchema,
      "Penilaian fetched successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid penilaian id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Penilaian not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createPenilaianRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Penilaians"],
  summary: "Create penilaian",
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
          schema: createPenilaianRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(
      penilaianMutationResponseSchema,
      "Penilaian created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updatePenilaianRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Penilaians"],
  summary: "Update penilaian",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: penilaianIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updatePenilaianRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(
      penilaianMutationResponseSchema,
      "Penilaian updated successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Penilaian not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deletePenilaianRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Penilaians"],
  summary: "Delete penilaian",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: penilaianIdParamsSchema,
  },
  responses: {
    200: jsonResponse(
      penilaianMutationResponseSchema,
      "Penilaian deleted successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Invalid penilaian id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "Penilaian not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
