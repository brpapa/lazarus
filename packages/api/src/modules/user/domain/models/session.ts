import { JwtAccessToken, JwtRefreshToken } from './jwt'

export interface UserSession {
  username: string
  refreshToken: JwtRefreshToken
  accessToken: JwtAccessToken
}
