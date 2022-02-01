import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Loading } from '~/components/v1'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import { Camera, CameraPermissions, MediasReview } from '~/screens'
import { useTheme } from '~/theme/v1'
import type { ReportStackParams } from './types'

const ReportStack = createStackNavigator<ReportStackParams>()

export function ReportStackNavigator() {
  const { navHeader } = useTheme()

  const { isLoading, allPermissionsIsGranted } = useCameraPermissions()
  if (isLoading) return <Loading />

  return (
    <ReportStack.Navigator
      initialRouteName={allPermissionsIsGranted ? 'Camera' : 'CameraPermissions'}
    >
      <ReportStack.Screen name="CameraPermissions" component={CameraPermissions} />
      <ReportStack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
      <ReportStack.Screen name="MediasReview" component={MediasReview} options={{ ...navHeader }} />
    </ReportStack.Navigator>
  )
}
