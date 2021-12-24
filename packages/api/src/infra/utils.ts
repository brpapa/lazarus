import debug from 'debug'
import { authService } from 'src/modules/user/services'

const log = debug('app:infra:utils')

export const getUserId = async (authorization?: string): Promise<string | null> => {
  if (!authorization) return null
  const token = authorization.replace('Bearer ', '').trim()
  const decodedToken = await authService.decodeJwt(token)
  if (!decodedToken) {
    log('The received access token is expired or invalid')
    return null
  }
  return decodedToken.userId
}
