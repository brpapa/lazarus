import { commitMutation, graphql } from 'react-relay'
import { environment } from '~/data/relay/environment'
import type {
  RefreshTokenInput,
  RefreshTokenMutation as RefreshTokenMutationType,
} from '~/__generated__/RefreshTokenMutation.graphql'

const mutation = graphql`
  mutation RefreshTokenMutation($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      result {
        __typename
        ... on RefreshTokenOkResult {
          accessToken
          accessTokenExpiresIn
        }
        ... on RefreshTokenErrResult {
          reason
          code
        }
      }
    }
  }
`

export const commitRefreshTokenMutation = (input: RefreshTokenInput) => {
  return new Promise<AccessToken>((res, rej) => {
    commitMutation<RefreshTokenMutationType>(environment, {
      mutation,
      variables: { input },
      onCompleted: (response, errors) => {
        if (errors !== null) rej(new Error(`Unexpected error: ${JSON.stringify(errors)}`))

        const result = response.refreshToken.result

        switch (result.__typename) {
          case 'RefreshTokenOkResult':
            res({
              value: result.accessToken,
              expiresIn: new Date(result.accessTokenExpiresIn as string),
            })
            break
          case 'RefreshTokenErrResult':
            rej(new Error(`Error to refresh token: ${JSON.stringify(result)}`))
            break
          default:
            rej(new Error(`Unexpected result typename: ${result.__typename}`))
        }
      },
      onError: rej,
    })
  })
}
