import React, { useCallback } from 'react'

import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import type { ReportStackParams } from '.'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import RoundedButton from '~/components/RoundedButton'
import { CloseIcon } from '~/assets/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PermissionsScreen() {
  const insets = useSafeAreaInsets()
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

  const closeCamera = useCallback(() => {
    reportNavigation.goBack()
  }, [reportNavigation])

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
      <Box position="absolute" right={insets.right+10} top={insets.top+10}>
        <RoundedButton my={'sm'} icon={CloseIcon} onPress={closeCamera} />
      </Box>
    </Box>
  )
}
