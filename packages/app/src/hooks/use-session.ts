import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { accessTokenState } from '~/data/recoil'
import { commitRefreshTokenMutation } from '~/data/relay/mutations/RefreshTokenMutation'
import { SecureStoreProxy } from '~/data/secure-store-proxy'

/** refresh the  current access token if it is expired */
export const useSession = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  const openSession = useCallback(
    async (accessToken: AccessToken, refreshToken?: string) => {
      setAccessToken(accessToken)
      if (refreshToken) await SecureStoreProxy.setRefreshToken(refreshToken)
    },
    [setAccessToken],
  )
  const closeSession = useCallback(() => setAccessToken(null), [setAccessToken])

  const handleAcessTokenExpired = useCallback(async () => {
    try {
      const refreshToken = await SecureStoreProxy.getRefreshToken()
      if (refreshToken === null) return closeSession()

      const newAccessToken = await commitRefreshTokenMutation({ refreshToken })
      openSession(newAccessToken)
    } catch {
      return closeSession()
    }
  }, [closeSession, openSession])

  useEffect(() => {
    if (!accessToken) return

    const accessTokenIsExpired = accessToken.expiresIn <= new Date()
    if (accessTokenIsExpired) handleAcessTokenExpired()
  }, [accessToken, handleAcessTokenExpired])

  return {
    isOpened: accessToken !== null,
    openSession,
    closeSession,
  }
}
