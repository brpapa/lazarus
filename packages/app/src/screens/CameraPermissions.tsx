import { useNavigation } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon } from '~/icons_LEGACY'
import Box from '~/components/v0-legacy/atoms/Box'
import Text from '~/components/v0-legacy/atoms/Text'
import MyButton from '~/components/v0-legacy/MyButton'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import type { ReportStackParams } from '../navigation/ReportStackNavigator'

export function CameraPermissions() {
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
    onAllPermissionsGranted: () =>
      reportNavigation.reset({ index: 0, routes: [{ name: 'Camera' }] }),
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
