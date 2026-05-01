import { PembimbingController } from "../controller/pembimbing.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createPembimbingRoute,
  deletePembimbingRoute,
  getAllPembimbingsRoute,
  getPembimbingByIdRoute,
  updatePembimbingRoute,
} from "./pembimbing.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllPembimbingsRoute, PembimbingController.getAll);
registerOpenApiRoute(
  router,
  getPembimbingByIdRoute,
  PembimbingController.getById,
);
registerOpenApiRoute(router, createPembimbingRoute, PembimbingController.create);
registerOpenApiRoute(router, updatePembimbingRoute, PembimbingController.update);
registerOpenApiRoute(router, deletePembimbingRoute, PembimbingController.delete);

export function getPembimbingOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Pembimbing API");
}

export default router;
