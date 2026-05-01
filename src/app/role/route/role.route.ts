import { RoleController } from "../controller/role.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import {
  createRoleRoute,
  deleteRoleRoute,
  getAllRolesRoute,
  getRoleByIdRoute,
  updateRoleRoute,
} from "./role.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllRolesRoute, RoleController.getAll);
registerOpenApiRoute(router, getRoleByIdRoute, RoleController.getById);
registerOpenApiRoute(router, createRoleRoute, RoleController.create);
registerOpenApiRoute(router, updateRoleRoute, RoleController.update);
registerOpenApiRoute(router, deleteRoleRoute, RoleController.delete);

export function getRoleOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Role API");
}

export default router;
