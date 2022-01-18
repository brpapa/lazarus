import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Loading from '~/components/v0-legacy/Loading'
import type { CapturedPicture } from '~/containers/Camera'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import { Camera, CameraPermissions, Medias } from '~/screens'

export type ReportStackParams = {
  CameraPermissions: undefined
  Camera?: {
    previousCapturedPictures?: CapturedPicture[]
  }
  Medias: {
    capturedPictures: CapturedPicture[]
  }
}
const ReportStack = createStackNavigator<ReportStackParams>()

export function ReportStackNavigator() {
  const { isLoading, allPermissionsIsGranted } = useCameraPermissions()
  if (isLoading) return <Loading />

  return (
    <ReportStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={allPermissionsIsGranted ? 'Camera' : 'CameraPermissions'}
    >
      <ReportStack.Screen name="CameraPermissions" component={CameraPermissions} />
      <ReportStack.Screen name="Camera" component={Camera} />
      <ReportStack.Screen name="Medias" component={Medias} />
    </ReportStack.Navigator>
  )
}
