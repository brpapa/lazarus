import { graphql } from 'react-relay'
import type {
  MarkAllNotificationsAsSeenErrCodeType,
  MarkAllNotificationsAsSeenInput,
  MarkAllNotificationsAsSeenMutation as MarkAllNotificationsAsSeenMutationType,
} from '~/__generated__/MarkAllNotificationsAsSeenMutation.graphql'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'
import { updateProfileTabBarBadgeValue } from '../utils/store'
import type { ErrResult } from '../utils/types'

// is good return all data that are changed by backend so the relay store is automatically updated based on node id
const mutation = graphql`
  mutation MarkAllNotificationsAsSeenMutation($input: MarkAllNotificationsAsSeenInput!) {
    markAllNotificationsAsSeen(input: $input) {
      __typename
      ... on MarkAllNotificationsAsSeenOkResult {
        notifications {
          id
          seenByTargetUser
        }
      }
      ... on MarkAllNotificationsAsSeenErrResult {
        reason
        reasonIsTranslated
        code
      }
    }
  }
`

type MarkAllNotificationsAsSeenOkResult = {}
type MarkAllNotificationsAsSeenErrResult = ErrResult<MarkAllNotificationsAsSeenErrCodeType>

export const useMarkAllNotificationsAsSeenMutation = createResultMutationHook<
  MarkAllNotificationsAsSeenMutationType,
  MarkAllNotificationsAsSeenInput,
  MarkAllNotificationsAsSeenOkResult,
  MarkAllNotificationsAsSeenErrResult
>({
  mutationName: 'markAllNotificationsAsSeen',
  resultTypenamePreffix: 'MarkAllNotificationsAsSeen',
  mutation,
  updater: (store) => {
    updateProfileTabBarBadgeValue(store, { type: 'SET', value: 0 })
  },
})
