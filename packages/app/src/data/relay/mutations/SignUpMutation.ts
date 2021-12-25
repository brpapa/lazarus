import { useCallback } from 'react'
import { graphql, useMutation } from 'react-relay'
import type {
  SignUpErrCodeType,
  SignUpInput,
  SignUpMutation as SignUpMutationType,
} from '~/__generated__/SignUpMutation.graphql'

const mutation = graphql`
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      result {
        __typename
        ... on SignUpOkResult {
          user {
            id
            userId
            username
            phoneNumber
          }
        }
        ... on SignUpErrResult {
          reason
          code
        }
      }
    }
  }
`

type Listeners = {
  onOkResult?: () => void
  onErrResult?: (error: { reason: string; code: SignUpErrCodeType }) => void
}

export const useSignUpMutation = () => {
  const [commit, isSending] = useMutation<SignUpMutationType>(mutation)

  const wrappedCommit = useCallback(
    (input: SignUpInput, listeners?: Listeners) =>
      commit({
        variables: { input },
        onCompleted: (response, errors) => {
          if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

          const result = response.signUp.result

          switch (result.__typename) {
            case 'SignUpOkResult':
              return listeners?.onOkResult && listeners.onOkResult()
            case 'SignUpErrResult':
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
