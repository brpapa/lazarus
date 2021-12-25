import assert from 'assert'
import jwt from 'jsonwebtoken'
import { IUserSessionRepo } from 'src/modules/incident/adapter/repositories/user-session-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { JwtAccessToken, JwtClaims, JwtRefreshToken } from 'src/modules/user/domain/models/jwt'
import { User } from 'src/modules/user/domain/models/user'
import { JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S, JWT_SECRET_KEY } from 'src/shared/config'
import { UUID } from 'src/shared/domain/models/uuid'

/**
 * persists jwt tokens to redis if is signed, and determine their validity
 */
export class AuthService implements IAuthService {
  constructor(private userSessionRepo: IUserSessionRepo) {}

  encodeJwt(claims: Omit<JwtClaims, 'exp'>): JwtAccessToken {
    return jwt.sign(claims, JWT_SECRET_KEY, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S,
    })
  }

  decodeJwt(token: JwtAccessToken): Promise<JwtClaims | null> {
    return new Promise((res) => {
      jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
        return error ? res(null) : res(<JwtClaims>decoded)
      })
    })
  }

  genRefreshToken(): JwtRefreshToken {
    return new UUID().toString()
  }

  async commitAuthenticatedUser(user: User): Promise<void> {
    if (user.isAuthenticated()) {
      assert(user.accessToken && user.refreshToken)

      await this.userSessionRepo.commit({
        username: user.username,
        refreshToken: user.refreshToken,
        accessToken: user.accessToken,
      })
    }
  }

  async unauthenticateUser(username: string): Promise<void> {
    this.userSessionRepo.delete(username)
  }

  getActiveTokens(username: string): Promise<JwtAccessToken[]> {
    return this.userSessionRepo.getAccessTokens(username)
  }

  getUserNameFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string | null> {
    return this.userSessionRepo.getUserName(refreshToken)
  }
}
