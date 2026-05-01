import { z } from "@hono/zod-openapi";
import { timestampSchema } from "./openapi-common";

export const roleSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Role");

export const menuSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Dashboard",
    }),
    path: z.string().openapi({
      example: "/dashboard",
    }),
    permission_path: z.string().nullable().openapi({
      example: null,
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Menu");

export const userRoleSummarySchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
  })
  .openapi("UserRoleSummary");

export const userSchema = z
  .object({
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
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
  })
  .openapi("User");

export const navigationPermissionSchema = z
  .object({
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: false,
    }),
    can_report: z.boolean().openapi({
      example: false,
    }),
  })
  .openapi("NavigationPermission");

export const navigationItemSchema: z.ZodTypeAny = z
  .object({
    id: z.number().int().openapi({
      example: 2,
    }),
    name: z.string().openapi({
      example: "Master Data",
    }),
    path: z.string().openapi({
      example: "/master-data",
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    permissions: navigationPermissionSchema,
    children: z.array(z.lazy(() => navigationItemSchema)),
  })
  .openapi("NavigationItem");

export const rolePermissionSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    role_id: z.number().int().openapi({
      example: 1,
    }),
    menu_id: z.number().int().openapi({
      example: 2,
    }),
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: true,
    }),
    can_report: z.boolean().openapi({
      example: true,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
    menu: z.object({
      id: z.number().int().openapi({
        example: 2,
      }),
      name: z.string().openapi({
        example: "Master Data",
      }),
      path: z.string().openapi({
        example: "/master-data",
      }),
      permission_path: z.string().nullable().openapi({
        example: null,
      }),
      icon: z.string().nullable().openapi({
        example: null,
      }),
      parent_id: z.number().int().nullable().openapi({
        example: null,
      }),
    }),
  })
  .openapi("RolePermission");

export const uploadSignatureResponseSchema = z
  .object({
    apiKey: z.string().openapi({
      example: "123456789012345",
    }),
    cloudName: z.string().openapi({
      example: "my-cloud",
    }),
    folder: z.string().openapi({
      example: "uploads",
    }),
    signature: z.string().openapi({
      example: "c1d2e3f4",
    }),
    timestamp: z.number().int().openapi({
      example: 1770000000,
    }),
    uploadUrl: z.string().url().openapi({
      example: "https://api.cloudinary.com/v1_1/my-cloud/image/upload",
    }),
  })
  .openapi("UploadSignatureResponse");
