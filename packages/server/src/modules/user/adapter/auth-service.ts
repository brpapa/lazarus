import { JwtClaims, JwtAccessToken, JwtRefreshToken } from '../domain/models/jwt'
import { User } from '../domain/models/user'

export interface IAuthService {
  /** generate/sign a JWT access token */
  encodeJwt(claims: JwtClaims): JwtAccessToken
  /** decode the JWT access token, if successful (not expired yet and a valid token) */
  decodeJwt(token: JwtAccessToken): Promise<JwtClaims | null>
  genRefreshToken(): JwtRefreshToken
  getActiveTokens(username: string): Promise<string[]>
  /** persist accessToken and refreshToken of user, upserting */
  commitAuthenticatedUser(user: User): Promise<void>
  /** clear all sessions of user, deleting */
  unauthenticateUser(username: string): Promise<void>
  /** if refresh token expired, returns null */
  getUserNameFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string | null>
}
