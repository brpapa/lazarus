import debug from 'debug'
import { authService } from 'src/modules/user/application/services'

const log = debug('app:infra:utils')

export const getUserId = async (authorization?: string): Promise<string | null> => {
  if (authorization === undefined) return null
  const decodedToken = await authService.decodeJwt(extractToken(authorization))
  if (!decodedToken) {
    log('The received access token is expired or invalid')
    return null
  }
  return decodedToken.userId
}

export const extractToken = (authorization: string) => {
  return authorization.replace('Bearer ', '').trim()
}
