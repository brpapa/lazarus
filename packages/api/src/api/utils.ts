import debug from 'debug'
import { authService } from '@user/application/services'

const log = debug('app:infra:utils')

export const getUserId = async (authorization?: string): Promise<string | null> => {
  if (!authorization) return null
  const token = extractToken(authorization)
  const decodedToken = await authService.decodeJwt(token)
  if (!decodedToken) {
    log('The received access token is expired or invalid')
    return null
  }
  return decodedToken.userId
}

export const getUserIdIgnoringExpiration = async (
  authorization?: string,
): Promise<string | null> => {
  if (!authorization) return null
  const token = extractToken(authorization)
  const { userId } = await authService.decodeJwtIgnoringExpiration(token)
  return userId
}

const extractToken = (authorization: string) => {
  return authorization.replace('Bearer ', '').trim()
}
