export type CreateMenuRequestDto = {
  name: string;
  path?: string | null;
  permission_path?: string | null;
  icon?: string | null;
  parent_id?: number | null;
};

export type UpdateMenuRequestDto = Partial<{
  name: string;
  path: string | null;
  permission_path: string | null;
  icon: string | null;
  parent_id: number | null;
}>;
