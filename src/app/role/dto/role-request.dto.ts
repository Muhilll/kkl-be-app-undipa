export type CreateRoleRequestDto = {
  code: string;
  name: string;
};

export type UpdateRoleRequestDto = Partial<{
  code: string;
  name: string;
}>;
