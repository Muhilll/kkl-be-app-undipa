import { JurusanController } from "../controller/jurusan.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createJurusanRoute,
  deleteJurusanRoute,
  getAllJurusansRoute,
  getJurusanByIdRoute,
  updateJurusanRoute,
} from "./jurusan.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllJurusansRoute, JurusanController.getAll);
registerOpenApiRoute(router, getJurusanByIdRoute, JurusanController.getById);
registerOpenApiRoute(router, createJurusanRoute, JurusanController.create);
registerOpenApiRoute(router, updateJurusanRoute, JurusanController.update);
registerOpenApiRoute(router, deleteJurusanRoute, JurusanController.delete);

export function getJurusanOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Jurusan API");
}

export default router;
