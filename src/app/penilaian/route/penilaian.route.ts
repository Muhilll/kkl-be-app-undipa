import { PenilaianController } from "../controller/penilaian.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createPenilaianRoute,
  deletePenilaianRoute,
  getAllPenilaiansRoute,
  getPenilaianByIdRoute,
  updatePenilaianRoute,
} from "./penilaian.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllPenilaiansRoute, PenilaianController.getAll);
registerOpenApiRoute(router, getPenilaianByIdRoute, PenilaianController.getById);
registerOpenApiRoute(router, createPenilaianRoute, PenilaianController.create);
registerOpenApiRoute(router, updatePenilaianRoute, PenilaianController.update);
registerOpenApiRoute(router, deletePenilaianRoute, PenilaianController.delete);

export function getPenilaianOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Penilaian API");
}

export default router;
