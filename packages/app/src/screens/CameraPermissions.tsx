import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View } from 'react-native'
import { FloatingButton, Text } from '~/components/v1/atoms'
import { useCameraPermissions } from '~/hooks/use-camera-permissions'
import type { ReportStackNavProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'

export function CameraPermissions() {
  const s = useStyles()
  const nav = useNavigation<ReportStackNavProp<'CameraPermissions'>>()

  const {
    isLoading,
    cameraPermissionIsGranted,
    microphonePermissionsIsGranted,
    requestCameraPermission,
    requestMicrophonePermission,
  } = useCameraPermissions({
    onAllPermissionsGranted: () => nav.reset({ index: 0, routes: [{ name: 'Camera' }] }),
  })

  if (isLoading) return null

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Please, you need provides the following permissions before report an incident</Text>
      <View>
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
      </View>
      <View style={s.closeContainer}>
        <FloatingButton icon={'Close'} onPress={nav.goBack} />
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ insets }) => ({
  closeContainer: {
    position: 'absolute',
    right: insets.right + 10,
    top: insets.top + 10,
  },
}))
