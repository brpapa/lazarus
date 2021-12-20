import { graphql } from 'react-relay'

const mutation = graphql`
  mutation useSignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      clientMutationId
      user {
        userId
      }
    }
  }
`

export const useSignUpMutation = () => {}