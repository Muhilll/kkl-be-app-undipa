import { RolePermissionEntity } from "../contract/role-permission.contract";

export type RolePermissionResponseDto = RolePermissionEntity & {
  role: {
    id: number;
    code: string;
    name: string;
  };
  menu: {
    id: number;
    name: string;
    path: string;
    permission_path: string | null;
    icon: string | null;
    parent_id: number | null;
  };
};
