import assert from 'assert'
import { RedisClient } from 'src/api/db/redis/client'
import { IUserSessionRepo } from '@incident/adapter/repositories/user-session-repo'
import { JwtAccessToken, JwtRefreshToken } from '@user/domain/models/jwt'
import { UserSession } from '@user/domain/models/session'
import { JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S } from 'src/config'

interface RedisKeyParams {
  username: string
  refreshToken: string
}

/**
 * each user session is persisted on Redis in a key-value data structure where:
 *  key: sessions/username={USERNAME}&refreshToken={REFRESH_TOKEN}
 *  value: {ACCESS_TOKEN}
 */
export class UserSessionRepo implements IUserSessionRepo {
  private REDIS_KEY_PREFFIX = 'sessions/'

  constructor(private redisClient: RedisClient) {}

  async getAccessTokens(username: string): Promise<JwtAccessToken[]> {
    const keys = await this.redisClient.keys(this.genKeyPattern({ username }))
    const values = keys.length > 0 ? await this.redisClient.mGet(keys) : []
    return values.filter((v) => v !== null) as string[]
  }

  async getUserName(refreshToken: JwtRefreshToken): Promise<string | null> {
    const [key] = await this.redisClient.keys(this.genKeyPattern({ refreshToken }))
    const refreshTokenExists = !!key
    if (!refreshTokenExists) return null
    return this.unhashKey(key).username
  }

  async commit(session: UserSession) {
    const key = this.hashToKey({
      username: session.username,
      refreshToken: session.refreshToken,
    })
    await this.redisClient.set(key, session.accessToken)
    await this.redisClient.expire(key, JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S)
  }

  async delete(username: string) {
    const keys = await this.redisClient.keys(this.genKeyPattern({ username }))
    if (keys.length > 0) await this.redisClient.del(keys)
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
