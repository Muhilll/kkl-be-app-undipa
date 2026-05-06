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
import { kklAgtSchema } from "../../../docs/openapi-schemas";

const kklAgtIdParamsSchema = createNumericPathParamsSchema("id");

const createKklAgtRequestSchema = z
  .object({
    kkl_klp_id: z.coerce.number().int().openapi({
      example: 1,
    }),
    mahasiswa_id: z.coerce.number().int().openapi({
      example: 1,
    }),
  })
  .openapi("CreateKklAgtRequest");

const updateKklAgtRequestSchema = z
  .object({
    kkl_klp_id: createOptionalCoercedIntSchema(1),
    mahasiswa_id: createOptionalCoercedIntSchema(1),
  })
  .openapi("UpdateKklAgtRequest");

const kklAgtListResponseSchema = createSuccessEnvelopeSchema(
  "KklAgtListResponse",
  z.array(kklAgtSchema),
  "KKL agts fetched successfully",
);

const kklAgtDetailResponseSchema = createSuccessEnvelopeSchema(
  "KklAgtDetailResponse",
  kklAgtSchema,
  "KKL agt fetched successfully",
);

const kklAgtMutationResponseSchema = createSuccessEnvelopeSchema(
  "KklAgtMutationResponse",
  writeResultSchema,
  "KKL agt created successfully",
);

export const getAllKklAgtsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["KKL Agts"],
  summary: "Get all KKL agts",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(kklAgtListResponseSchema, "KKL agts fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getKklAgtByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["KKL Agts"],
  summary: "Get KKL agt by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklAgtIdParamsSchema,
  },
  responses: {
    200: jsonResponse(kklAgtDetailResponseSchema, "KKL agt fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL agt id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL agt not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getKklAgtByMahasiswaIdRoute = createRoute({
  method: "get",
  path: "/by-mahasiswa/{mahasiswaId}",
  tags: ["KKL Agts"],
  summary: "Get KKL agt detail by mahasiswa id",
  security: protectedSecurity,
  middleware: [jwtMiddleware, appTokenMiddleware] as const,
  request: {
    params: createNumericPathParamsSchema("mahasiswaId"),
  },
  responses: {
    200: jsonResponse(kklAgtDetailResponseSchema, "KKL agt fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid mahasiswa id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    404: jsonResponse(apiErrorResponseSchema, "KKL data not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getKklAgtsByKlpIdRoute = createRoute({
  method: "get",
  path: "/by-klp/{klpId}",
  tags: ["KKL Agts"],
  summary: "Get KKL agt members by kelompok id",
  security: protectedSecurity,
  middleware: [jwtMiddleware, appTokenMiddleware] as const,
  request: {
    params: createNumericPathParamsSchema("klpId"),
  },
  responses: {
    200: jsonResponse(kklAgtListResponseSchema, "KKL agts fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid klp id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createKklAgtRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["KKL Agts"],
  summary: "Create KKL agt",
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
          schema: createKklAgtRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(kklAgtMutationResponseSchema, "KKL agt created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateKklAgtRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["KKL Agts"],
  summary: "Update KKL agt",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklAgtIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateKklAgtRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(kklAgtMutationResponseSchema, "KKL agt updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL agt not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteKklAgtRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["KKL Agts"],
  summary: "Delete KKL agt",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: kklAgtIdParamsSchema,
  },
  responses: {
    200: jsonResponse(kklAgtMutationResponseSchema, "KKL agt deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid KKL agt id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "KKL agt not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
