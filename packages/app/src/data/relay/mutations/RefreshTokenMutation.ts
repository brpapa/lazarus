import type { Result } from '@metis/shared'
import { graphql } from 'react-relay'
import type {
  RefreshTokenErrCodeType,
  RefreshTokenInput,
  RefreshTokenMutation as RefreshTokenMutationType,
} from '~/__generated__/RefreshTokenMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'

type RefreshTokenOkResult = {
  accessToken: string
  accessTokenExpiresIn: string
}
type RefreshTokenErrResult = {
  reason: string
  code: RefreshTokenErrCodeType
}

const commit = createResultMutationCommitFn<
  RefreshTokenMutationType,
  RefreshTokenInput,
  RefreshTokenOkResult,
  RefreshTokenErrResult
>({
  mutationName: 'refreshToken',
  resultTypenamePreffix: 'RefreshToken',
  mutation: graphql`
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
  `,
})

export const commitRefreshTokenMutation = (
  input: RefreshTokenInput,
): Promise<Result<AccessToken, RefreshTokenErrResult>> =>
  commit(input).then((result) =>
    result.mapOk((res) => {
      return {
        value: res.accessToken,
        expiresIn: new Date(res.accessTokenExpiresIn),
      }
    }),
  )
