import { useCallback } from 'react'
import { useMutation } from 'react-relay'
import { useRecoilState } from 'recoil'
import { userJwtToken } from '~/data/recoil/user-jwt-token'
import { SignInMutation, SignUpMutation } from '~/data/relay/mutations/UserAuth'

export const useAuth = () => {
  const [jwtToken, setJwtToken] = useRecoilState(userJwtToken)
  // const [signIn] = useMutation(SignInMutation)
  // const [signUp] = useMutation(SignUpMutation)

  const signIn = useCallback(
    async (username: string, password: string) => {
      setJwtToken('response.accessToken')
      // signIn({
      //   variables: { username, password },
      //   onError: console.error,
      //   onCompleted: (response, errors) => {
      //     if (errors) {
      //       console.error(errors)
      //       return
      //     }
      //     setJwtToken(response.accessToken)
      //   },
      // })
    },
    [setJwtToken],
  )

  const signUp = useCallback(
    (username: string, password: string) => {
      setJwtToken('response.accessToken')
      // signUp({
      //   variables: { username, password },
      //   onError: console.error,
      //   onCompleted: (response, errors) => {
      //     if (errors) {
      //       console.error(errors)
      //       return
      //     }
      //     setJwtToken(response.accessToken)
      //   },
      // })
    },
    [setJwtToken],
  )

  const signOut = useCallback(() => {
    setJwtToken(null)
  }, [setJwtToken])

  return {
    isSignedIn: jwtToken !== null,
    signIn,
    signUp,
    signOut,
  }
}
