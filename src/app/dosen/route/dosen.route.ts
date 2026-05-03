import { DosenController } from "../controller/dosen.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerDefaultSecuritySchemes,
  registerOpenApiRoute,
} from "../../../docs/openapi-common";
import {
  createDosenRoute,
  deleteDosenRoute,
  getAllDosensRoute,
  getDosenByIdRoute,
  updateDosenRoute,
} from "./dosen.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllDosensRoute, DosenController.getAll);
registerOpenApiRoute(router, getDosenByIdRoute, DosenController.getById);
registerOpenApiRoute(router, createDosenRoute, DosenController.create);
registerOpenApiRoute(router, updateDosenRoute, DosenController.update);
registerOpenApiRoute(router, deleteDosenRoute, DosenController.delete);

export function getDosenOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dosen API");
}

export default router;
