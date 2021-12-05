import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import PermissionsScreen from './PermissionsScreen'
import CameraScreen from './CameraScreen'
import MediasScreen from './MediasScreen'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'

export type ReportStackParams = {
  Permissions: undefined
  Camera: {
    previousCapturedMedias?: CapturedMedia[]
  }
  Medias: {
    capturedMedias: CapturedMedia[]
  }
}
const ReportStack = createStackNavigator<ReportStackParams>()

// DOING: usuario adiona/remove imagens/videos no app, depois quando clica em submit report, sobe midias pro s3 e manda mutation pra criar incident
export function ReportStackScreen() {
  const { isLoading, allPermissionsIsGranted } = useCameraPermissions()
  if (isLoading) return null

  return (
    <ReportStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={allPermissionsIsGranted ? 'Camera' : 'Permissions'}
    >
      <ReportStack.Screen name="Permissions" component={PermissionsScreen} />
      <ReportStack.Screen name="Camera" component={CameraScreen} />
      <ReportStack.Screen name="Medias" component={MediasScreen} />
    </ReportStack.Navigator>
  )
}
