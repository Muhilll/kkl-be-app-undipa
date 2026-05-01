export type CreateRolePermissionRequestDto = {
  role_id: number;
  menu_id: number;
  can_read?: boolean;
  can_create?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
  can_report?: boolean;
};

export type UpdateRolePermissionRequestDto = Partial<{
  role_id: number;
  menu_id: number;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}>;
