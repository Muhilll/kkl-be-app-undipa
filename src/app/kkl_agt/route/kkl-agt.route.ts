import { KklAgtController } from "../controller/kkl-agt.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createKklAgtRoute,
  deleteKklAgtRoute,
  getAllKklAgtsRoute,
  getKklAgtByIdRoute,
  updateKklAgtRoute,
} from "./kkl-agt.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllKklAgtsRoute, KklAgtController.getAll);
registerOpenApiRoute(router, getKklAgtByIdRoute, KklAgtController.getById);
registerOpenApiRoute(router, createKklAgtRoute, KklAgtController.create);
registerOpenApiRoute(router, updateKklAgtRoute, KklAgtController.update);
registerOpenApiRoute(router, deleteKklAgtRoute, KklAgtController.delete);

export function getKklAgtOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "KKL AGT API");
}

export default router;
