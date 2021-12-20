import { graphql } from 'react-relay'

const mutation = graphql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      result {
        __typename
        ... on SignInOkResult {
          accessToken
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

export const useSignInMutation = () => {}