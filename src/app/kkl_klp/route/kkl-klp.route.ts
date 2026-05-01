import { KklKlpController } from "../controller/kkl-klp.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createKklKlpRoute,
  deleteKklKlpRoute,
  getAllKklKlpsRoute,
  getKklKlpByIdRoute,
  updateKklKlpRoute,
} from "./kkl-klp.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllKklKlpsRoute, KklKlpController.getAll);
registerOpenApiRoute(router, getKklKlpByIdRoute, KklKlpController.getById);
registerOpenApiRoute(router, createKklKlpRoute, KklKlpController.create);
registerOpenApiRoute(router, updateKklKlpRoute, KklKlpController.update);
registerOpenApiRoute(router, deleteKklKlpRoute, KklKlpController.delete);

export function getKklKlpOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "KKL KLP API");
}

export default router;
