import { graphql } from 'react-relay'
import type {
  MarkNotificationAsSeenErrCodeType,
  MarkNotificationAsSeenInput,
  MarkNotificationAsSeenMutation as MarkNotificationAsSeenMutationType,
} from '~/__generated__/MarkNotificationAsSeenMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'
import { updateProfileTabBarBadgeValue } from '../utils/store'
import type { ErrResult } from '../utils/types'

// is good return all data that are changed by backend so the relay store is automatically updated based on node id
const mutation = graphql`
  mutation MarkNotificationAsSeenMutation($input: MarkNotificationAsSeenInput!) {
    markNotificationAsSeen(input: $input) {
      __typename
      ... on MarkNotificationAsSeenOkResult {
        notification {
          id
          seenByTargetUser
        }
      }
      ... on MarkNotificationAsSeenErrResult {
        reason
        reasonIsTranslated
        code
      }
    }
  }
`

type MarkNotificationAsSeenOkResult = {}
type MarkNotificationAsSeenErrResult = ErrResult<MarkNotificationAsSeenErrCodeType>

export const useMarkNotificationAsSeenMutation = createResultMutationHook<
  MarkNotificationAsSeenMutationType,
  MarkNotificationAsSeenInput,
  MarkNotificationAsSeenOkResult,
  MarkNotificationAsSeenErrResult
>({
  mutationName: 'markNotificationAsSeen',
  resultTypenamePreffix: 'MarkNotificationAsSeen',
  mutation,
  updater: (store) => {
    updateProfileTabBarBadgeValue(store, { type: 'INCREMENT', value: -1 })
  },
})

export const commitMarkNotificationAsSeenMutation = createResultMutationCommitFn<
  MarkNotificationAsSeenMutationType,
  MarkNotificationAsSeenInput,
  MarkNotificationAsSeenOkResult,
  MarkNotificationAsSeenErrResult
>({
  mutationName: 'markNotificationAsSeen',
  resultTypenamePreffix: 'MarkNotificationAsSeen',
  mutation,
})
