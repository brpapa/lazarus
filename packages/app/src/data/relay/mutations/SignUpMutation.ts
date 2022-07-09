import { graphql } from 'react-relay'
import type {
  SignUpErrCodeType,
  SignUpInput,
  SignUpMutation as SignUpMutationType,
} from '~/__generated__/SignUpMutation.graphql'
import { createResultMutationHook } from './../utils/create-result-mutation-hook'
import type { ErrResult } from '../utils/types'

const mutation = graphql`
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      __typename
      ... on SignUpOkResult {
        user {
          id
          userId
          username
          email
          name
        }
      }
      ... on SignUpErrResult {
        reason
        reasonIsTranslated
        code
      }
    }
  }
`

type SignUpOkResult = {}
type SignUpErrResult = ErrResult<SignUpErrCodeType>

export const useSignUpMutation = createResultMutationHook<
  SignUpMutationType,
  SignUpInput,
  SignUpOkResult,
  SignUpErrResult
>({
  mutationName: 'signUp',
  resultTypenamePreffix: 'SignUp',
  mutation,
})
