import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { userJwtToken } from '~/data/recoil/user-jwt-token'
import { useSignInMutation } from './mutations/SignInMutation'
import { useSignUpMutation } from './mutations/SignUpMutation'

export const useSession = () => {
  const [jwtToken, setJwtToken] = useRecoilState(userJwtToken)

  const signOut = useCallback(() => {
    setJwtToken(null)
  }, [setJwtToken])

  return {
    isSignedIn: jwtToken !== null,
    signOut,
  }
}
