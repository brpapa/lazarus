import { graphql } from 'relay-runtime'
import type {
  UpdateUserLocationErrCodeType,
  UpdateUserLocationInput,
  UpdateUserLocationMutation as UpdateUserLocationMutationType,
} from '~/__generated__/UpdateUserLocationMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'
import type { ErrResult } from '../utils/types'

const mutation = graphql`
  mutation UpdateUserLocationMutation($input: UpdateUserLocationInput!) {
    updateUserLocation(input: $input) {
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
        reasonIsTranslated
        code
      }
    }
  }
`

type UpdateUserLocationOkResult = {}
type UpdateUserLocationErrResult = ErrResult<UpdateUserLocationErrCodeType>

export const commitUpdateUserLocationMutation = createResultMutationCommitFn<
  UpdateUserLocationMutationType,
  UpdateUserLocationInput,
  UpdateUserLocationOkResult,
  UpdateUserLocationErrResult
>({
  mutationName: 'updateUserLocation',
  resultTypenamePreffix: 'UpdateUserLocation',
  mutation,
})
