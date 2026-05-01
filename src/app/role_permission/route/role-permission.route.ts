import { RolePermissionController } from "../controller/role-permission.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import {
  createRolePermissionRoute,
  deleteRolePermissionRoute,
  getAllRolePermissionsRoute,
  getRolePermissionByIdRoute,
  getRolePermissionsByRoleIdRoute,
  updateRolePermissionRoute,
} from "./role-permission.openapi";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getAllRolePermissionsRoute, RolePermissionController.getAll);
registerOpenApiRoute(router, getRolePermissionByIdRoute, RolePermissionController.getById);
registerOpenApiRoute(
  router,
  getRolePermissionsByRoleIdRoute,
  RolePermissionController.getByRoleId,
);
registerOpenApiRoute(router, createRolePermissionRoute, RolePermissionController.create);
registerOpenApiRoute(router, updateRolePermissionRoute, RolePermissionController.update);
registerOpenApiRoute(router, deleteRolePermissionRoute, RolePermissionController.delete);

export function getRolePermissionOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Role Permission API");
}

export default router;
