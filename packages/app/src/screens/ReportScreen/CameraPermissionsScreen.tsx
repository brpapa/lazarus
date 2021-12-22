import { useNavigation } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon } from '~/assets/icons'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import MyButton from '~/components/MyButton'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import type { ReportStackParams } from '.'

export default function CameraPermissionsScreen() {
  const insets = useSafeAreaInsets()
  const reportNavigation =
    useNavigation<StackNavigationProp<ReportStackParams, 'CameraPermissions'>>()
  const {
    isLoading,
    cameraPermissionIsGranted,
    microphonePermissionsIsGranted,
    requestCameraPermission,
    requestMicrophonePermission,
  } = useCameraPermissions({
    onAllPermissionsGranted: () => reportNavigation.push('Camera'),
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
      <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
        <MyButton my={'sm'} icon={CloseIcon} onPress={reportNavigation.goBack} />
      </Box>
    </Box>
  )
}
