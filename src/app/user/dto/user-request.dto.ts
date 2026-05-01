export type LoginRequestDto = {
  email: string;
  password: string;
};

export type CreateUserRequestDto = {
  email: string;
  password: string;
  name: string;
  role_id: number;
};

export type UpdateUserRequestDto = Partial<{
  email: string;
  password: string;
  name: string;
  role_id: number;
}>;
