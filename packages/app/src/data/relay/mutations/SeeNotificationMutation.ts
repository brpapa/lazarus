import { graphql } from 'react-relay'
import type {
  SeeNotificationErrCodeType,
  SeeNotificationInput,
  SeeNotificationMutation as SeeNotificationMutationType,
} from '~/__generated__/SeeNotificationMutation.graphql'
import { createResultMutationCommitFn } from '../utils/create-result-mutation-commit-fn'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'

// is good return all data that are changed by backend so the relay store is automatically updated based on node id
const mutation = graphql`
  mutation SeeNotificationMutation($input: SeeNotificationInput!) {
    seeNotification(input: $input) {
      result {
        __typename
        ... on SeeNotificationOkResult {
          notification {
            id
            seenByTargetUser
          }
        }
        ... on SeeNotificationErrResult {
          reason
          code
        }
      }
    }
  }
`

type SeeNotificationOkResult = {}
type SeeNotificationErrResult = { reason: string; code: SeeNotificationErrCodeType }

export const useSeeNotificationMutation = createResultMutationHook<
  SeeNotificationMutationType,
  SeeNotificationInput,
  SeeNotificationOkResult,
  SeeNotificationErrResult
>({
  mutationName: 'seeNotification',
  resultTypenamePreffix: 'SeeNotification',
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

export const commitSeeNotificationMutation = createResultMutationCommitFn<
  SeeNotificationMutationType,
  SeeNotificationInput,
  SeeNotificationOkResult,
  SeeNotificationErrResult
>({
  mutationName: 'seeNotification',
  resultTypenamePreffix: 'SeeNotification',
  mutation,
})
