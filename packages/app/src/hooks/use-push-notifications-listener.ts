import { useNavigation } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { resolveNotificationLink, NotificationLink } from '~/navigation/helpers'
import { commitMarkNotificationAsSeenMutation } from '../data/relay/mutations/MarkNotificationAsSeenMutation'

// determines how handles notifications that come in while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const usePushNotificationsListener = ({ when }: { when: boolean }) => {
  const nav = useNavigation()

  useEffect(() => {
    if (!when) return

    // fired whenever a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener((_) => {
      // console.log(_.request.content)
    })

    // fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { data } = response.notification.request.content

        if (
          typeof data?.link?.entity !== 'string' ||
          typeof data?.link?.entityId !== 'string' ||
          typeof data?.notificationId !== 'string'
        )
          throw new Error(`Bad data object. Received: ${JSON.stringify(data)}`)

        const { link, notificationId } = data

        resolveNotificationLink(nav, link as NotificationLink)

        const result = await commitMarkNotificationAsSeenMutation({ notificationId })
        result.mapErr(console.error)
      },
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [nav, when])
}
