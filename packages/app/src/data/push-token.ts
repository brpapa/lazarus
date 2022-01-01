import { Alert } from 'react-native'
import * as Notifications from 'expo-notifications'
import { __ANDROID__, __DEVICE_IS_SIMULATOR__ } from '../config'

/** 
 * returns the expo push token of device 
 * or null if the user did not grant permission 
 * or null if the http request to expo's server fail
 */
export const getPushToken = async (): Promise<string | null> => {
  if (__DEVICE_IS_SIMULATOR__) {
    Alert.alert('Must use physical device for Push Notifications')
    return null
  }

  const status = await Notifications.getPermissionsAsync()
  if (!status.granted) return null

  if (__ANDROID__) {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync()
    return token.data
  } catch (e) {
    console.error('Failed to request Expo server', e)
    return null
  }
}
