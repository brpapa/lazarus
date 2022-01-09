import assert from 'assert'
import jwt from 'jsonwebtoken'
import { IUserSessionRepo } from '@incident/adapter/repositories/user-session-repo'
import { IAuthService } from '@user/adapter/auth-service'
import { JwtAccessToken, JwtClaims, JwtRefreshToken } from '@user/domain/models/jwt'
import { User } from '@user/domain/models/user'
import { JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S, JWT_SECRET_KEY } from 'src/config'
import { UUID } from '@shared/domain/models/uuid'

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

  decodeJwtIgnoringExpiration(token: JwtAccessToken): Promise<JwtClaims> {
    return new Promise((res, rej) => {
      jwt.verify(token, JWT_SECRET_KEY, { ignoreExpiration: true }, (error, decoded) => {
        return error ? rej(error) : res(<JwtClaims>decoded)
      })
    })
  }

  genRefreshToken(): JwtRefreshToken {
    return new UUID().toString()
  }

  async authenticateUser(user: User): Promise<void> {
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
