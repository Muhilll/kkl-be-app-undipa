import { LaporanController } from "../controller/laporan.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createLaporanRoute,
  deleteLaporanRoute,
  getAllLaporansRoute,
  getLaporanByIdRoute,
  getLaporansByMahasiswaIdRoute,
  checkTodayLaporanByMahasiswaIdRoute,
  updateLaporanRoute,
} from "./laporan.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllLaporansRoute, LaporanController.getAll);
registerOpenApiRoute(router, getLaporansByMahasiswaIdRoute, LaporanController.getByMahasiswaId);
registerOpenApiRoute(router, checkTodayLaporanByMahasiswaIdRoute, LaporanController.checkTodayByMahasiswaId);
registerOpenApiRoute(router, getLaporanByIdRoute, LaporanController.getById);
registerOpenApiRoute(router, createLaporanRoute, LaporanController.create);
registerOpenApiRoute(router, updateLaporanRoute, LaporanController.update);
registerOpenApiRoute(router, deleteLaporanRoute, LaporanController.delete);

export function getLaporanOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Laporan API");
}

export default router;
