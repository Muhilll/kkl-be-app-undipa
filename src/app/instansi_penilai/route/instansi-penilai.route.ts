import { InstansiPenilaiController } from "../controller/instansi-penilai.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createInstansiPenilaiRoute,
  deleteInstansiPenilaiRoute,
  getAllInstansiPenilaisRoute,
  getInstansiPenilaiByIdRoute,
  updateInstansiPenilaiRoute,
} from "./instansi-penilai.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllInstansiPenilaisRoute, InstansiPenilaiController.getAll);
registerOpenApiRoute(router, getInstansiPenilaiByIdRoute, InstansiPenilaiController.getById);
registerOpenApiRoute(router, createInstansiPenilaiRoute, InstansiPenilaiController.create);
registerOpenApiRoute(router, updateInstansiPenilaiRoute, InstansiPenilaiController.update);
registerOpenApiRoute(router, deleteInstansiPenilaiRoute, InstansiPenilaiController.delete);

export function getInstansiPenilaiOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Instansi Penilai API");
}

export default router;
