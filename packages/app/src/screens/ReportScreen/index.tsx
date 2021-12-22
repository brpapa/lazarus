import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Loading from '~/components/Loading'
import type { CapturedPicture } from '~/containers/Camera'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import CameraScreen from './CameraScreen'
import MediasScreen from './MediasScreen'
import CameraPermissionsScreen from './CameraPermissionsScreen'

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

export function ReportStackScreen() {
  const { isLoading, allPermissionsIsGranted } = useCameraPermissions()
  if (isLoading) return <Loading />

  return (
    <ReportStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={allPermissionsIsGranted ? 'Camera' : 'CameraPermissions'}
    >
      <ReportStack.Screen name="CameraPermissions" component={CameraPermissionsScreen} />
      <ReportStack.Screen name="Camera" component={CameraScreen} />
      <ReportStack.Screen name="Medias" component={MediasScreen} />
    </ReportStack.Navigator>
  )
}
