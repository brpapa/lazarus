import React from 'react'

import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import type { ReportStackParams } from '.'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'

export default function PermissionsScreen() {
  const reportNavigation = useNavigation<StackNavigationProp<ReportStackParams, 'Permissions'>>()
  const {
    isLoading,
    cameraPermissionIsGranted,
    microphonePermissionsIsGranted,
    requestCameraPermission,
    requestMicrophonePermission,
  } = useCameraPermissions({
    onAllPermissionsGranted: () => reportNavigation.replace('Camera', {}),
  })

  if (isLoading) return null

  return (
    <Box flex={1} bg="background" alignItems="center" justifyContent="center">
      <Text>Please, you need provides the following permissions before report an incident</Text>
      <Box>
        {!cameraPermissionIsGranted && (
          <Text>
            Camera permission
            <Text variant="link" onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
        {!microphonePermissionsIsGranted && (
          <Text>
            Microphone permission
            <Text variant="link" onPress={requestMicrophonePermission}>
              Grant
            </Text>
          </Text>
        )}
      </Box>
    </Box>
  )
}
