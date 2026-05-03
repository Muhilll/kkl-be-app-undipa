import { getMenuOpenApiDocument } from "../app/menu/route/menu.route";
import { getJurusanOpenApiDocument } from "../app/jurusan/route/jurusan.route";
import { getMahasiswaOpenApiDocument } from "../app/mahasiswa/route/mahasiswa.route";
import { getDosenOpenApiDocument } from "../app/dosen/route/dosen.route";
import { getInstansiOpenApiDocument } from "../app/instansi/route/instansi.route";
import { getInstansiPenilaiOpenApiDocument } from "../app/instansi_penilai/route/instansi-penilai.route";
import { getKklPeriodeOpenApiDocument } from "../app/kkl_periode/route/kkl-periode.route";
import { getKklKlpOpenApiDocument } from "../app/kkl_klp/route/kkl-klp.route";
import { getKklAgtOpenApiDocument } from "../app/kkl_agt/route/kkl-agt.route";
import { getPenilaianOpenApiDocument } from "../app/penilaian/route/penilaian.route";
import { getLaporanOpenApiDocument } from "../app/laporan/route/laporan.route";
import { getRoleOpenApiDocument } from "../app/role/route/role.route";
import { getRolePermissionOpenApiDocument } from "../app/role_permission/route/role-permission.route";
import { getUploadOpenApiDocument } from "../app/upload/route/upload.route";
import { getUserOpenApiDocument } from "../app/user/route/user.route";
import type { SecurityRequirementObject } from "openapi3-ts/oas30";

type OpenApiDocument = Record<string, any>;

const scalarCdnUrl =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.35.3";

const protectedSecurity: SecurityRequirementObject[] = [
  { BearerAuth: [], AppToken: [] },
];

function mergeTagDefinitions(
  baseTags: Array<Record<string, unknown>> = [],
  incomingTags: Array<Record<string, unknown>> = [],
) {
  const mergedTags = new Map<string, Record<string, unknown>>();

  for (const tag of [...baseTags, ...incomingTags]) {
    const tagName = typeof tag.name === "string" ? tag.name : undefined;

    if (!tagName) {
      continue;
    }

    if (!mergedTags.has(tagName)) {
      mergedTags.set(tagName, tag);
      continue;
    }

    mergedTags.set(tagName, {
      ...tag,
      ...mergedTags.get(tagName),
    });
  }

  return Array.from(mergedTags.values());
}

function mergeOpenApiDocument(
  baseDocument: OpenApiDocument,
  incomingDocument: OpenApiDocument,
) {
  return {
    ...baseDocument,
    tags: mergeTagDefinitions(baseDocument.tags, incomingDocument.tags),
    paths: {
      ...(baseDocument.paths ?? {}),
      ...(incomingDocument.paths ?? {}),
    },
    components: {
      ...(baseDocument.components ?? {}),
      ...(incomingDocument.components ?? {}),
      schemas: {
        ...(baseDocument.components?.schemas ?? {}),
        ...(incomingDocument.components?.schemas ?? {}),
      },
      securitySchemes: {
        ...(baseDocument.components?.securitySchemes ?? {}),
        ...(incomingDocument.components?.securitySchemes ?? {}),
      },
      parameters: {
        ...(baseDocument.components?.parameters ?? {}),
        ...(incomingDocument.components?.parameters ?? {}),
      },
      responses: {
        ...(baseDocument.components?.responses ?? {}),
        ...(incomingDocument.components?.responses ?? {}),
      },
      requestBodies: {
        ...(baseDocument.components?.requestBodies ?? {}),
        ...(incomingDocument.components?.requestBodies ?? {}),
      },
    },
  };
}

function mountOpenApiPaths(
  document: OpenApiDocument,
  mountPath: string,
) {
  const normalizedMountPath =
    mountPath === "/" ? mountPath : mountPath.replace(/\/+$/, "");
  const mountedPaths = Object.fromEntries(
    Object.entries(document.paths ?? {}).map(([path, value]) => {
      if (path === "/" || path === "") {
        return [normalizedMountPath, value];
      }

      return [`${normalizedMountPath}${path}`, value];
    }),
  );

  return {
    ...document,
    paths: mountedPaths,
  };
}

function createBaseDocument(baseUrl: string): OpenApiDocument {
  return {
    openapi: "3.0.3",
    info: {
      title: "Hono Backend Starter API",
      version: "1.0.0",
      description: [
        "OpenAPI reference untuk backend starter berbasis Hono.",
        "",
        "Endpoint protected umumnya membutuhkan dua header:",
        "- `Authorization: Bearer <jwt>`",
        "- `X-App-Token: <APP_TOKEN>`",
        "",
        "Catatan:",
        "- `POST /api/users/login` bersifat public",
        "- Upload memakai satu konfigurasi Cloudinary melalui `POST /api/uploads/signature`",
      ].join("\n"),
    },
    servers: [
      {
        url: baseUrl,
        description: "Current server",
      },
    ],
    tags: [
      { name: "System", description: "Public health and root endpoints" },
      { name: "Users", description: "Authentication and user management" },
      { name: "Roles", description: "Role master data" },
      { name: "Jurusans", description: "Jurusan master data" },
      { name: "Mahasiswas", description: "Mahasiswa master data" },
      { name: "Dosens", description: "Dosen master data" },
      { name: "Instansis", description: "Instansi master data" },
      { name: "InstansiPenilais", description: "Instansi Penilai data" },
      { name: "KKL Periodes", description: "KKL periode master data" },
      { name: "KKL Klps", description: "KKL kelompok data" },
      { name: "KKL Agts", description: "KKL anggota data" },
      { name: "Penilaians", description: "Penilaian data" },
      { name: "Laporans", description: "Laporan KKL data" },
      { name: "Menus", description: "Navigation menu management" },
      {
        name: "Role Permissions",
        description: "Role-based access control permissions",
      },
      {
        name: "Uploads",
        description: "Cloudinary signed upload helpers",
      },
    ],
    security: protectedSecurity,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token from POST /api/users/login",
        },
        AppToken: {
          type: "apiKey",
          in: "header",
          name: "X-App-Token",
          description: "Application token defined in APP_TOKEN",
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["System"],
          summary: "Welcome endpoint",
          security: [],
          responses: {
            200: {
              description: "Welcome information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "Welcome to Hono Backend Starter API",
                      },
                      version: {
                        type: "string",
                        example: "1.0.0",
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        example: "2026-04-27T10:00:00.000Z",
                      },
                    },
                    required: ["success", "message", "version", "timestamp"],
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          security: [],
          responses: {
            200: {
              description: "Health check response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "API is running",
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        example: "2026-04-27T10:00:00.000Z",
                      },
                    },
                    required: ["success", "message", "timestamp"],
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function getServerUrl(requestUrl: string): string {
  return new URL(requestUrl).origin;
}

export function createOpenApiDocument(baseUrl: string) {
  const moduleDocuments = [
    mountOpenApiPaths(getUserOpenApiDocument(baseUrl), "/api/users"),
    mountOpenApiPaths(getRoleOpenApiDocument(baseUrl), "/api/roles"),
    mountOpenApiPaths(getJurusanOpenApiDocument(baseUrl), "/api/jurusans"),
    mountOpenApiPaths(
      getMahasiswaOpenApiDocument(baseUrl),
      "/api/mahasiswas",
    ),
    mountOpenApiPaths(
      getDosenOpenApiDocument(baseUrl),
      "/api/dosens",
    ),
    mountOpenApiPaths(getInstansiOpenApiDocument(baseUrl), "/api/instansis"),
    mountOpenApiPaths(getInstansiPenilaiOpenApiDocument(baseUrl), "/api/instansi-penilais"),
    mountOpenApiPaths(
      getKklPeriodeOpenApiDocument(baseUrl),
      "/api/kkl-periodes",
    ),
    mountOpenApiPaths(getKklKlpOpenApiDocument(baseUrl), "/api/kkl-klps"),
    mountOpenApiPaths(getKklAgtOpenApiDocument(baseUrl), "/api/kkl-agts"),
    mountOpenApiPaths(getPenilaianOpenApiDocument(baseUrl), "/api/penilaians"),
    mountOpenApiPaths(getLaporanOpenApiDocument(baseUrl), "/api/laporans"),
    mountOpenApiPaths(getMenuOpenApiDocument(baseUrl), "/api/menus"),
    mountOpenApiPaths(
      getRolePermissionOpenApiDocument(baseUrl),
      "/api/role-permissions",
    ),
    mountOpenApiPaths(getUploadOpenApiDocument(baseUrl), "/api/uploads"),
  ];

  return moduleDocuments.reduce(
    (document, moduleDocument) =>
      mergeOpenApiDocument(document, moduleDocument),
    createBaseDocument(baseUrl),
  );
}

export function renderScalarReference(specUrl: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hono Backend Starter API Reference</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="${scalarCdnUrl}"></script>
    <script>
      Scalar.createApiReference("#app", {
        url: ${JSON.stringify(specUrl)}
      })
    </script>
  </body>
</html>`;
}
