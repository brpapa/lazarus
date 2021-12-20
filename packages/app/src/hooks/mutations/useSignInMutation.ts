import { graphql } from 'react-relay'

const mutation = graphql`
  mutation useSignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const useSignInMutation = () => {}