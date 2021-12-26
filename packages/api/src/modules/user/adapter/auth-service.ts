import { JwtClaims, JwtAccessToken, JwtRefreshToken } from '../domain/models/jwt'
import { User } from '../domain/models/user'

export interface IAuthService {
  /** generate/sign a JWT access token */
  encodeJwt(claims: Omit<JwtClaims, 'exp'>): JwtAccessToken
  /** decode the JWT access token, returns null if the token expired or is invalid */
  decodeJwt(token: JwtAccessToken): Promise<JwtClaims | null>
  genRefreshToken(): JwtRefreshToken
  getActiveTokens(username: string): Promise<string[]>
  /** persist accessToken and refreshToken of user, if refresh token already exists, overwrites the related accessToken */
  authenticateUser(user: User): Promise<void>
  /** clear all sessions of user, deleting */
  unauthenticateUser(username: string): Promise<void>
  /** returns null if the refresh token expired */
  getUserNameFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string | null>
}
