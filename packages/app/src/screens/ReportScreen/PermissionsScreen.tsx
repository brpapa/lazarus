import React from 'react'

import type { ReportStackParams } from '.'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import { XStack, Paragraph } from '~/components/atomics'

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
    <XStack flex={1} bg="$bg" alignItems="center" justifyContent="center">
      <Paragraph>
        Please, you need provides the following permissions before report an incident
      </Paragraph>
      <XStack>
        {!cameraPermissionIsGranted && (
          <Paragraph>
            Camera permission
            <Paragraph color="$blue1" onPress={requestCameraPermission}>
              Grant
            </Paragraph>
          </Paragraph>
        )}
        {!microphonePermissionsIsGranted && (
          <Paragraph>
            Microphone permission
            <Paragraph color="$blue1" onPress={requestMicrophonePermission}>
              Grant
            </Paragraph>
          </Paragraph>
        )}
      </XStack>
    </XStack>
  )
}
