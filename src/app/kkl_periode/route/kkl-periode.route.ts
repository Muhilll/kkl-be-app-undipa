import { KklPeriodeController } from "../controller/kkl-periode.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createKklPeriodeRoute,
  deleteKklPeriodeRoute,
  getAllKklPeriodesRoute,
  getKklPeriodeByIdRoute,
  activateKklPeriodeRoute,
  updateKklPeriodeRoute,
} from "./kkl-periode.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllKklPeriodesRoute, KklPeriodeController.getAll);
registerOpenApiRoute(
  router,
  getKklPeriodeByIdRoute,
  KklPeriodeController.getById,
);
registerOpenApiRoute(router, createKklPeriodeRoute, KklPeriodeController.create);
registerOpenApiRoute(router, updateKklPeriodeRoute, KklPeriodeController.update);
registerOpenApiRoute(router, activateKklPeriodeRoute, KklPeriodeController.activate);
registerOpenApiRoute(router, deleteKklPeriodeRoute, KklPeriodeController.delete);

export function getKklPeriodeOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "KKL Periode API");
}

export default router;
