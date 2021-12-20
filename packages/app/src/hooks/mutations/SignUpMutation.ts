import { graphql } from 'react-relay'

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

export const useSignUpMutation = () => {}
