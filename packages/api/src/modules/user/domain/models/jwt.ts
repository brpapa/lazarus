/** payload encoded into the JWT token */
export interface JwtClaims {
  userId: string
  username: string
  /** expiry timestamp in epoch unix (ms) */
  exp: number
}

export type JwtAccessToken = string
export type JwtRefreshToken = string
