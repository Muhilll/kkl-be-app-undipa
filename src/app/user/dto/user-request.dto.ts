export type LoginRequestDto = {
  username: string;
  password: string;
};

export type CreateUserRequestDto = {
  username: string;
  password: string;
  role_id: number;
  is_active?: boolean;
};

export type UpdateUserRequestDto = Partial<{
  username: string;
  password: string;
  role_id: number;
  is_active: boolean;
}>;
