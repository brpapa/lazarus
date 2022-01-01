import { useCallback } from 'react'
import { graphql, useMutation } from 'react-relay'
import type {
  SignInErrCodeType,
  SignInInput,
  SignInMutation as SignInMutationType
} from '~/__generated__/SignInMutation.graphql'

const mutation = graphql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      result {
        __typename
        ... on SignInOkResult {
          accessToken
          accessTokenExpiresIn
          refreshToken
        }
        ... on SignInErrResult {
          reason
          code
        }
      }
    }
  }
`

type Listeners = {
  onOkResult?: (result: {
    accessToken: string
    accessTokenExpiresIn: string
    refreshToken: string
  }) => void
  onErrResult?: (result: { reason: string; code: SignInErrCodeType }) => void
}

export const useSignInMutation = () => {
  const [commit, isSending] = useMutation<SignInMutationType>(mutation)

  const wrappedCommit = useCallback(
    async (input: SignInInput, listeners?: Listeners) =>
      commit({
        variables: { input },
        onCompleted: (response, errors) => {
          if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

          const result = response.signIn.result

          switch (result.__typename) {
            case 'SignInOkResult':
              return listeners?.onOkResult && listeners.onOkResult(result)
            case 'SignInErrResult':
              return listeners?.onErrResult && listeners.onErrResult(result)
            default:
              throw new Error(`Unexpected result typename: ${result.__typename}`)
          }
        },
        onError: (error) => {
          throw error
        },
      }),
    [],
  )

  return [wrappedCommit, isSending] as const
}
