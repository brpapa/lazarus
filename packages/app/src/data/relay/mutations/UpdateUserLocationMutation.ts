import { graphql } from 'relay-runtime'
import type {
  UpdateUserLocationErrCodeType,
  UpdateUserLocationInput,
  UpdateUserLocationMutation as UpdateUserLocationMutationType,
} from '~/__generated__/UpdateUserLocationMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'

type UpdateUserLocationOkResult = {}
type UpdateUserLocationErrResult = { reason: string; code: UpdateUserLocationErrCodeType }

export const commitUpdateUserLocationMutation = createResultMutationCommitFn<
  UpdateUserLocationMutationType,
  UpdateUserLocationInput,
  UpdateUserLocationOkResult,
  UpdateUserLocationErrResult
>({
  mutationName: 'updateUserLocation',
  resultTypenamePreffix: 'UpdateUserLocation',
  mutation: graphql`
    mutation UpdateUserLocationMutation($input: UpdateUserLocationInput!) {
      updateUserLocation(input: $input) {
        result {
          __typename
          ... on UpdateUserLocationOkResult {
            user {
              id
              location {
                latitude
                longitude
              }
            }
          }
          ... on UpdateUserLocationErrResult {
            reason
            code
          }
        }
      }
    }
  `,
})
