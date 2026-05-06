import { NavigationItem, PublicUser } from "../contract/user.contract";

export type LoginResponseDto = {
  token: string;
  expires_at: number;
  user: {
    id: number;
    username: string;
    role_id: number;
    is_active: boolean;
  };
};

export type UserResponseDto = PublicUser;

export type NavigationResponseDto = NavigationItem[];
