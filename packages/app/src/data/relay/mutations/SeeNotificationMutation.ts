import { useCallback } from 'react'
import { commitMutation, graphql, useMutation } from 'react-relay'
import { environment } from '~/data/relay/environment'
import type {
  SeeNotificationInput,
  SeeNotificationMutation as SeeNotificationMutationType,
} from '~/__generated__/SeeNotificationMutation.graphql'

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

export const commitSeeNotificationMutation = (notificationId: string) => {
  return new Promise<void>((res, rej) => {
    commitMutation<SeeNotificationMutationType>(environment, {
      mutation,
      variables: { input: { notificationId } },
      onCompleted: (response, errors) => {
        if (errors !== null) rej(new Error(`Unexpected error: ${JSON.stringify(errors)}`))

        const result = response.seeNotification.result

        switch (result.__typename) {
          case 'SeeNotificationOkResult':
            res()
            break
          case 'SeeNotificationErrResult':
            rej(new Error(`Error to see notification: ${JSON.stringify(result)}`))
            break
          default:
            rej(new Error(`Unexpected result typename: ${result.__typename}`))
        }
      },
      onError: rej,
    })
  })
}

type Listeners = {
  onOkResult?: () => void
}

export const useSeeNotificationMutation = () => {
  const [commit, isSending] = useMutation<SeeNotificationMutationType>(mutation)

  const wrappedCommit = useCallback(
    async (input: SeeNotificationInput, listeners?: Listeners) =>
      commit({
        variables: { input },
        onCompleted: (response, errors) => {
          if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

          const result = response.seeNotification.result

          switch (result.__typename) {
            case 'SeeNotificationOkResult':
              return listeners?.onOkResult && listeners.onOkResult()
            case 'SeeNotificationErrResult':
              console.error(`Error to see notification: ${JSON.stringify(result)}`)
              return
            default:
              throw new Error(`Unexpected result typename: ${result.__typename}`)
          }
        },
        updater: (store) => {
          // define how update the relay store after a successfull response

          const myNotificationsRecord = store.getRoot().getLinkedRecord('myNotifications')
          if (!myNotificationsRecord) throw new Error('Not found root.myNotifications record')

          const notSeenCount = myNotificationsRecord.getValue('notSeenCount')
          if (typeof notSeenCount !== 'number')
            throw new Error('Value of root.myNotifications.notSeenCount scalar is not a number')

          myNotificationsRecord.setValue(notSeenCount - 1, 'notSeenCount')
        },
        onError: (error) => {
          throw error
        },
      }),
    [],
  )

  return [wrappedCommit, isSending] as const
}
