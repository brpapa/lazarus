import { graphql } from 'react-relay'
import type {
  MarkNotificationAsSeenErrCodeType,
  MarkNotificationAsSeenInput,
  MarkNotificationAsSeenMutation as MarkNotificationAsSeenMutationType,
} from '~/__generated__/MarkNotificationAsSeenMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'

// is good return all data that are changed by backend so the relay store is automatically updated based on node id
const mutation = graphql`
  mutation MarkNotificationAsSeenMutation($input: MarkNotificationAsSeenInput!) {
    markNotificationAsSeen(input: $input) {
      result {
        __typename
        ... on MarkNotificationAsSeenOkResult {
          notification {
            id
            seenByTargetUser
          }
        }
        ... on MarkNotificationAsSeenErrResult {
          reason
          code
        }
      }
    }
  }
`

type MarkNotificationAsSeenOkResult = {}
type MarkNotificationAsSeenErrResult = {
  reason: string
  code: MarkNotificationAsSeenErrCodeType
}

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
    const myNotificationsRecord = store.getRoot().getLinkedRecord('myNotifications')
    if (!myNotificationsRecord) throw new Error('Not found root.myNotifications record')

    const notSeenCount = myNotificationsRecord.getValue('notSeenCount')
    if (typeof notSeenCount !== 'number')
      throw new Error('Value of root.myNotifications.notSeenCount scalar is not a number')

    myNotificationsRecord.setValue(notSeenCount - 1, 'notSeenCount')
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
