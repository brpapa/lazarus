import { graphql } from 'react-relay'
import type {
  SignInErrCodeType,
  SignInInput,
  SignInMutation as SignInMutationType,
} from '~/__generated__/SignInMutation.graphql'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'

type SignInOkResult = {
  accessToken: string
  accessTokenExpiresIn: string
  refreshToken: string
}

type SignInErrResult = {
  reason: string
  code: SignInErrCodeType
}

export const useSignInMutation = createResultMutationHook<
  SignInMutationType,
  SignInInput,
  SignInOkResult,
  SignInErrResult
>({
  mutationName: 'signIn',
  resultTypenamePreffix: 'SignIn',
  mutation: graphql`
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
  `,
})
