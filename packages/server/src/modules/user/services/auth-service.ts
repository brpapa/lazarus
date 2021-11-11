import assert from 'assert'
import jwt from 'jsonwebtoken'
import {
  JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S,
  JWT_SECRET_KEY,
  JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S,
} from 'src/shared/config'
import { UUID } from 'src/shared/domain/models/uuid'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { JwtAccessToken, JwtClaims, JwtRefreshToken } from 'src/modules/user/domain/models/jwt'
import { User } from 'src/modules/user/domain/models/user'
import { RedisClient } from 'src/infra/db/redis/client'

interface RedisKeyParams {
  username: string
  refreshToken: string
}

// each data entry in redis represents a session of an user
// key: sessions/username={USERNAME}&refreshToken={REFRESH_TOKEN}
// value: {ACCESS_TOKEN}

/** persists jwt tokens to redis if is signed, and determine their validity */
export class AuthService implements IAuthService {
  private REDIS_KEY_PREFFIX = 'sessions/'

  constructor(private redisClient: RedisClient) {}

  encodeJwt(claims: JwtClaims): JwtAccessToken {
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

      const key = this.hashToKey({
        username: user.username,
        refreshToken: user.refreshToken,
      })

      await this.redisClient.set(key, user.accessToken)
      await this.redisClient.expire(key, JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S)
    }
  }

  async unauthenticateUser(username: string): Promise<void> {
    const keys = await this.redisClient.keys(this.genKeyPattern({ username }))
    if (keys.length > 0) await this.redisClient.del(keys)
  }

  async getActiveTokens(username: string): Promise<string[]> {
    const keys = await this.redisClient.keys(this.genKeyPattern({ username }))
    const values = keys.length > 0 ? await this.redisClient.mGet(keys) : []
    return values.filter((v) => v !== null) as string[]
  }

  async getUserNameFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string | null> {
    const [key] = await this.redisClient.keys(this.genKeyPattern({ refreshToken }))
    const refreshTokenExists = !!key
    if (!refreshTokenExists) return null

    return this.unhashKey(key).username
  }

  // keys match pattern: https://redis.io/commands/keys
  private genKeyPattern(keyParamsOpt: Partial<RedisKeyParams>) {
    const queryString = new URLSearchParams({
      username: keyParamsOpt.username || '*',
      refreshToken: keyParamsOpt.refreshToken || '*',
    }).toString()
    return `${this.REDIS_KEY_PREFFIX}${queryString}`
  }

  private hashToKey(keyParams: RedisKeyParams): string {
    const queryString = new URLSearchParams({
      username: keyParams.username,
      refreshToken: keyParams.refreshToken,
    }).toString()
    return `${this.REDIS_KEY_PREFFIX}${queryString}`
  }

  private unhashKey(key: string): RedisKeyParams {
    const preffix = key.indexOf(this.REDIS_KEY_PREFFIX)
    if (preffix === -1) throw new Error(`Key preffix not found into: ${key}`)
    const preffixEndIndex = preffix + this.REDIS_KEY_PREFFIX.length

    const queryString = key.substring(preffixEndIndex)
    const keyParams = new URLSearchParams(queryString)

    const username = keyParams.get('username')
    assert(username !== null)
    const refreshToken = keyParams.get('refreshToken')
    assert(refreshToken !== null)
    return { username, refreshToken }
  }
}
