import { UploadController } from "../controller/upload.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import { createUploadSignatureRoute } from "./upload.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(
  router,
  createUploadSignatureRoute,
  UploadController.createSignature,
);

export function getUploadOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Upload API");
}

export default router;
