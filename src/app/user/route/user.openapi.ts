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
import {
  navigationItemSchema,
  userSchema,
} from "../../../docs/openapi-schemas";

const userIdParamsSchema = createNumericPathParamsSchema("id");

const loginRequestSchema = z
  .object({
    email: z.string().email().openapi({
      example: "admin@example.com",
    }),
    password: z.string().min(1).openapi({
      example: "admin123",
    }),
  })
  .openapi("LoginRequest");

const loginDataSchema = z
  .object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
    }),
    user: z.object({
      id: z.number().int().openapi({
        example: 1,
      }),
      email: z.string().email().openapi({
        example: "admin@example.com",
      }),
      name: z.string().openapi({
        example: "Admin User",
      }),
      role_id: z.number().int().openapi({
        example: 1,
      }),
    }),
  })
  .openapi("LoginResponse");

const createUserRequestSchema = z
  .object({
    email: z.string().email().openapi({
      example: "staff@example.com",
    }),
    password: z.string().min(1).openapi({
      example: "staff123",
    }),
    name: z.string().min(1).openapi({
      example: "Staff User",
    }),
    role_id: z.coerce.number().int().openapi({
      example: 2,
    }),
  })
  .openapi("CreateUserRequest");

const updateUserRequestSchema = z
  .object({
    email: z.string().email().optional().openapi({
      example: "staff.updated@example.com",
    }),
    password: z.string().min(1).optional().openapi({
      example: "newpassword123",
    }),
    name: z.string().min(1).optional().openapi({
      example: "Staff User Update",
    }),
    role_id: createOptionalCoercedIntSchema(3),
  })
  .openapi("UpdateUserRequest");

const loginResponseSchema = createSuccessEnvelopeSchema(
  "LoginEnvelopeResponse",
  loginDataSchema,
  "Login successful",
);

const userListResponseSchema = createSuccessEnvelopeSchema(
  "UserListResponse",
  z.array(userSchema),
  "Users fetched successfully",
);

const userDetailResponseSchema = createSuccessEnvelopeSchema(
  "UserDetailResponse",
  userSchema,
  "User fetched successfully",
);

const userMutationResponseSchema = createSuccessEnvelopeSchema(
  "UserMutationResponse",
  writeResultSchema,
  "User created successfully",
);

const navigationResponseSchema = createSuccessEnvelopeSchema(
  "NavigationResponse",
  z.array(navigationItemSchema),
  "Navigation fetched successfully",
);

export const loginUserRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Users"],
  summary: "Login user",
  security: [],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(loginResponseSchema, "Successful login"),
    400: jsonResponse(apiErrorResponseSchema, "Email and password are required"),
    401: jsonResponse(apiErrorResponseSchema, "Invalid email or password"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getAllUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  summary: "Get all users",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  responses: {
    200: jsonResponse(userListResponseSchema, "Users fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getCurrentUserNavigationRoute = createRoute({
  method: "get",
  path: "/me/navigation",
  tags: ["Users"],
  summary: "Get current user navigation tree",
  security: protectedSecurity,
  middleware: [jwtMiddleware, appTokenMiddleware] as const,
  responses: {
    200: jsonResponse(navigationResponseSchema, "Navigation fetched successfully"),
    401: jsonResponse(
      apiErrorResponseSchema,
      "Unauthorized - User role not found",
    ),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const getUserByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  summary: "Get user by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: userIdParamsSchema,
  },
  responses: {
    200: jsonResponse(userDetailResponseSchema, "User fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid user id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "User not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  summary: "Create user",
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
          schema: createUserRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(userMutationResponseSchema, "User created successfully"),
    400: jsonResponse(
      apiErrorResponseSchema,
      "Validation error or email already registered",
    ),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const updateUserRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Users"],
  summary: "Update user",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: userIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(userMutationResponseSchema, "User updated successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "User not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});

export const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Users"],
  summary: "Delete user",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission(),
  ] as const,
  request: {
    params: userIdParamsSchema,
  },
  responses: {
    200: jsonResponse(userMutationResponseSchema, "User deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid user id"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
    403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
    404: jsonResponse(apiErrorResponseSchema, "User not found"),
    500: jsonResponse(apiErrorResponseSchema, "Internal server error"),
  },
});
