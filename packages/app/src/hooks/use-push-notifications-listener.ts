import { useNavigation } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'

// determines how handles notifications that come in while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const usePushNotificationsListener = ({ when }: { when: boolean }) => {
  const navigation = useNavigation()

  useEffect(() => {
    if (!when) return

    // fired whenever a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener((_) => {
      // console.log(_.request.content)
    })

    // fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content
      if (typeof data?.incidentId !== 'string')
        throw new Error(`It was expected an incidentId field in data, received data object: ${JSON.stringify(data)}`)
      
      navigation.navigate('Incident', { incidentId: data.incidentId })
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [navigation, when])
}
