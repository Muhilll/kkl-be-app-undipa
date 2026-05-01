import { InstansiController } from "../controller/instansi.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createInstansiRoute,
  deleteInstansiRoute,
  getAllInstansisRoute,
  getInstansiByIdRoute,
  updateInstansiRoute,
} from "./instansi.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllInstansisRoute, InstansiController.getAll);
registerOpenApiRoute(router, getInstansiByIdRoute, InstansiController.getById);
registerOpenApiRoute(router, createInstansiRoute, InstansiController.create);
registerOpenApiRoute(router, updateInstansiRoute, InstansiController.update);
registerOpenApiRoute(router, deleteInstansiRoute, InstansiController.delete);

export function getInstansiOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Instansi API");
}

export default router;
