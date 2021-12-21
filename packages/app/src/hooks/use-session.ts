import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { userJwtTokenState } from '~/data/recoil'

export const useSession = () => {
  const [userJwtToken, setUserJwtToken] = useRecoilState(userJwtTokenState)

  const openSession = useCallback((jwtToken: string) => setUserJwtToken(jwtToken), [setUserJwtToken])
  const closeSession = useCallback(() => setUserJwtToken(null), [setUserJwtToken])

  return {
    isSignedIn: userJwtToken !== null,
    openSession,
    closeSession,
  }
}
