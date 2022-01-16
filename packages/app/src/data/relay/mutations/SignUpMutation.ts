import { graphql } from 'react-relay'
import type {
  SignUpErrCodeType,
  SignUpInput,
  SignUpMutation as SignUpMutationType,
} from '~/__generated__/SignUpMutation.graphql'
import { createResultMutationHook } from './../utils/create-result-mutation-hook'

type SignUpOkResult = {}
type SignUpErrResult = { reason: string; code: SignUpErrCodeType }

export const useSignUpMutation = createResultMutationHook<
  SignUpMutationType,
  SignUpInput,
  SignUpOkResult,
  SignUpErrResult
>({
  mutationName: 'signUp',
  resultTypenamePreffix: 'SignUp',
  mutation: graphql`
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
  `,
})
