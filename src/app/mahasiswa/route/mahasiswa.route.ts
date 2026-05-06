import { MahasiswaController } from "../controller/mahasiswa.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createMahasiswaRoute,
  deleteMahasiswaRoute,
  getAllMahasiswasRoute,
  getMahasiswaByIdRoute,
  getMahasiswaByUserIdRoute,
  updateMahasiswaRoute,
} from "./mahasiswa.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllMahasiswasRoute, MahasiswaController.getAll);
registerOpenApiRoute(router, getMahasiswaByUserIdRoute, MahasiswaController.getByUserId);
registerOpenApiRoute(router, getMahasiswaByIdRoute, MahasiswaController.getById);
registerOpenApiRoute(router, createMahasiswaRoute, MahasiswaController.create);
registerOpenApiRoute(router, updateMahasiswaRoute, MahasiswaController.update);
registerOpenApiRoute(router, deleteMahasiswaRoute, MahasiswaController.delete);

export function getMahasiswaOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Mahasiswa API");
}

export default router;
