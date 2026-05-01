import { NavigationItem, PublicUser } from "../contract/user.contract";

export type LoginResponseDto = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role_id: number;
  };
};

export type UserResponseDto = PublicUser;

export type NavigationResponseDto = NavigationItem[];
