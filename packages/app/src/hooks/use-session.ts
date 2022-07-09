import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { accessTokenState } from '~/data/recoil'
import { commitRefreshTokenMutation } from '~/data/relay/mutations/RefreshTokenMutation'
import { AuthTokensManager } from '~/data/storage/auth-tokens-manager'

/** refresh the current access token if it is expired */
export const useSession = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  /** start a sessions will redirect the user to auth screens */
  const startSession = useCallback(
    async (accessToken: AccessToken, refreshToken?: string) => {
      setAccessToken(accessToken)
      if (refreshToken) await AuthTokensManager.setRefreshToken(refreshToken)
    },
    [setAccessToken],
  )
  const closeSession = useCallback(() => {
    setAccessToken(null)
    AuthTokensManager.deleteAllTokens()
  }, [setAccessToken])

  const handleAcessTokenExpired = useCallback(async () => {
    try {
      const refreshToken = await AuthTokensManager.getRefreshToken()
      if (refreshToken === null) return closeSession()

      const result = await commitRefreshTokenMutation({ refreshToken })
      result.map((accessToken) => startSession(accessToken), console.error)
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
