import { PermissionStatus } from 'expo-location'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import * as Location from 'expo-location'

type Options = {
  onAllPermissionsWasGranted?: () => void
}

export const useLocationPermissions = (opts?: Options) => {
  const [locationForegroundPermission, setLocationForegroundPermission] =
    useState<PermissionStatus>()
  const [locationBackgroundPermission, setLocationBackgroundPermission] =
    useState<PermissionStatus>()

  const allPermissionsIsGranted =
    locationForegroundPermission === PermissionStatus.GRANTED &&
    locationBackgroundPermission === PermissionStatus.GRANTED

  const isLoading = !locationForegroundPermission || !locationBackgroundPermission

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then((r) => setLocationForegroundPermission(r.status))
    Location.getBackgroundPermissionsAsync().then((r) => setLocationBackgroundPermission(r.status))
  }, [])

  useEffect(() => {
    if (allPermissionsIsGranted && opts?.onAllPermissionsWasGranted) opts.onAllPermissionsWasGranted()
  }, [allPermissionsIsGranted, opts])

  const requestLocationForegroundPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === PermissionStatus.DENIED) await Linking.openSettings()
    setLocationForegroundPermission(status)
  }, [])

  const requestLocationBackgroundPermission = useCallback(async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync()
    if (status === PermissionStatus.DENIED) await Linking.openSettings()
    setLocationBackgroundPermission(status)
  }, [])

  return {
    isLoading: isLoading,
    allPermissionsIsGranted,
    locationForegroundPermissionIsGranted:
      locationForegroundPermission === PermissionStatus.GRANTED,
    locationBackgroundPermissionIsGranted:
      locationBackgroundPermission === PermissionStatus.GRANTED,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
  }
}
