import { compare } from "bcryptjs";
import { generateToken } from "../../../utils/jwt";
import { LoginResponseDto } from "../dto/user-response.dto";
import { UserReadRepository } from "../repository/user-read.repository";

export class UserAuthService {
  static async login(
    username: string,
    password: string,
  ): Promise<LoginResponseDto | null> {
    const user = await UserReadRepository.getUserByUsername(username);

    if (!user || !user.is_active) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      is_active: user.is_active,
    });

    // Token default expiry is 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return {
      token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        is_active: user.is_active,
      },
    };
  }
}
