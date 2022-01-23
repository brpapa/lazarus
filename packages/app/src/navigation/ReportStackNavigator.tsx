import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Loading } from '~/components/v1/atoms'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import { Camera, CameraPermissions, Medias } from '~/screens'
import type { ReportStackParams } from './types'

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
