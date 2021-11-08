/** payload encoded into the JWT token */
export interface JwtClaims {
  userId: string
  username: string
}

export type JwtAccessToken = string
export type JwtRefreshToken = string
