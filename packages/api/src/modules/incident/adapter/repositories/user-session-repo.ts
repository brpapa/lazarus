import { JwtAccessToken, JwtRefreshToken } from '@user/domain/models/jwt'
import { UserSession } from '@user/domain/models/session'

export interface IUserSessionRepo {
  getAccessTokens(username: string): Promise<JwtAccessToken[]>
  getUserName(refreshToken: JwtRefreshToken): Promise<string | null>
  commit(session: UserSession): Promise<void>
  delete(username: string): Promise<void>
}
