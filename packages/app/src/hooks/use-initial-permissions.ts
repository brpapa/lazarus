import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'

type Options = {
  onAllPermissionsWasGranted?: () => void
}

export const useInitialPermissions = (opts?: Options) => {
  // TODO: required grant
  const [locationForegroundPermissionIsGranted, setLocationForegroundPermission] =
    useState<boolean>()
  // TODO: optional grant
  const [locationBackgroundPermissionIsGranted, setLocationBackgroundPermission] =
    useState<boolean>()
  // TODO: optional grant
  const [pushNotificationPermissionIsGranted, setPushNotificationPermission] = useState<boolean>()

  const allPermissionsIsGranted = [
    locationForegroundPermissionIsGranted,
    // locationBackgroundPermissionIsGranted, // TODO: error in expo go with a real device
    pushNotificationPermissionIsGranted,
  ].every((p) => p === true)

  const isLoading = [
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    pushNotificationPermissionIsGranted,
  ].every((p) => p === undefined)

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then((r) => setLocationForegroundPermission(r.granted))
    Location.getBackgroundPermissionsAsync().then((r) => setLocationBackgroundPermission(r.granted))
    Notifications.getPermissionsAsync().then((r) => setPushNotificationPermission(r.granted))
  }, [])

  useEffect(() => {
    if (allPermissionsIsGranted && opts?.onAllPermissionsWasGranted)
      opts.onAllPermissionsWasGranted()
  }, [allPermissionsIsGranted, opts])

  const requestLocationForegroundPermission = useCallback(async () => {
    const response = await Location.requestForegroundPermissionsAsync()
    setLocationForegroundPermission(response.granted)
    if (!response.granted) await Linking.openSettings()
  }, [])

  const requestLocationBackgroundPermission = useCallback(async () => {
    const response = await Location.requestBackgroundPermissionsAsync()
    setLocationBackgroundPermission(response.granted)
    if (!response.granted) await Linking.openSettings()
  }, [])

  const requestPushNotificationPermission = useCallback(async () => {
    const response = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    })
    const granted =
      response.granted || response.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED

    setPushNotificationPermission(granted)
    if (!response.granted) await Linking.openSettings()
  }, [])

  return {
    isLoading,
    allPermissionsIsGranted,
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    pushNotificationPermissionIsGranted,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
    requestPushNotificationPermission,
  }
}
