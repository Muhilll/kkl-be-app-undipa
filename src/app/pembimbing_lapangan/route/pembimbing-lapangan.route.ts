import { PembimbingLapanganController } from "../controller/pembimbing-lapangan.controller";
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
} from "./pembimbing-lapangan.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllPembimbingsRoute, PembimbingLapanganController.getAll);
registerOpenApiRoute(router, getPembimbingByIdRoute, PembimbingLapanganController.getById);
registerOpenApiRoute(router, createPembimbingRoute, PembimbingLapanganController.create);
registerOpenApiRoute(router, updatePembimbingRoute, PembimbingLapanganController.update);
registerOpenApiRoute(router, deletePembimbingRoute, PembimbingLapanganController.delete);

export function getPembimbingLapanganOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Pembimbing Lapangan API");
}

export default router;
