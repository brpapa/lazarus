import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { accessTokenState } from '~/data/recoil'
import { commitRefreshTokenMutation } from '~/data/relay/mutations/RefreshTokenMutation'
import { AuthTokensManager } from '~/data/auth-tokens-manager'

/** refresh the current access token if it is expired */
export const useSession = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  const startSession = useCallback(
    async (accessToken: AccessToken, refreshToken?: string) => {
      setAccessToken(accessToken)
      if (refreshToken) await AuthTokensManager.setRefreshToken(refreshToken)
    },
    [setAccessToken],
  )
  const closeSession = useCallback(() => setAccessToken(null), [setAccessToken])

  const handleAcessTokenExpired = useCallback(async () => {
    try {
      const refreshToken = await AuthTokensManager.getRefreshToken()
      if (refreshToken === null) return closeSession()

      const newAccessToken = await commitRefreshTokenMutation({ refreshToken })
      startSession(newAccessToken)
    } catch (e) {
      console.error(e)
      return closeSession()
    }
  }, [closeSession, startSession])

  useEffect(() => {
    if (accessToken === null) return
    if (AuthTokensManager.isExpiredNow(accessToken)) handleAcessTokenExpired()
  }, [accessToken, handleAcessTokenExpired])

  return {
    isSignedIn: accessToken !== null && !AuthTokensManager.isExpiredNow(accessToken),
    startSession,
    closeSession,
  }
}
