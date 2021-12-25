import { useEffect, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { accessTokenState } from '~/data/recoil'

export const useSession = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  const openSession = useCallback(
    (accessToken: string, expiresIn: Date) => setAccessToken({ value: accessToken, expiresIn }),
    [setAccessToken],
  )
  const closeSession = useCallback(() => setAccessToken(null), [setAccessToken])

  useEffect(() => {
    if (!accessToken) return

    const isExpired = accessToken.expiresIn <= new Date()
    if (isExpired) closeSession()
  }, [accessToken, closeSession])

  return {
    isOpened: accessToken !== null,
    openSession,
    closeSession,
  }
}
