import { Camera, PermissionStatus } from 'expo-camera'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'

type Options = {
  onAllPermissionsGranted?: () => void
}

/** load camera/microphone permissions status */
export const useCameraPermissions = (opts?: Options) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<PermissionStatus>()
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<PermissionStatus>()

  const allPermissionsIsGranted =
    cameraPermissionStatus === PermissionStatus.GRANTED &&
    microphonePermissionStatus === PermissionStatus.GRANTED

  const isLoading = !cameraPermissionStatus || !microphonePermissionStatus

  useEffect(() => {
    Camera.getCameraPermissionsAsync().then((r) => setCameraPermissionStatus(r.status))
    Camera.getMicrophonePermissionsAsync().then((r) => setMicrophonePermissionStatus(r.status))
  }, [])

  useEffect(() => {
    if (allPermissionsIsGranted && opts?.onAllPermissionsGranted) opts.onAllPermissionsGranted()
  }, [allPermissionsIsGranted, opts])

  const requestCameraPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === PermissionStatus.DENIED) await Linking.openSettings()
    setCameraPermissionStatus(status)
  }, [])

  const requestMicrophonePermission = useCallback(async () => {
    const { status } = await Camera.requestMicrophonePermissionsAsync()
    if (status === PermissionStatus.DENIED) await Linking.openSettings()
    setMicrophonePermissionStatus(status)
  }, [])

  return {
    isLoading: isLoading,
    allPermissionsIsGranted,
    cameraPermissionIsGranted: cameraPermissionStatus === PermissionStatus.GRANTED,
    microphonePermissionsIsGranted: microphonePermissionStatus === PermissionStatus.GRANTED,
    requestCameraPermission,
    requestMicrophonePermission,
  }
}
