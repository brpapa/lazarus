import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useRef, useState } from 'react'
import { Alert, StatusBar, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon, RotateIcon } from '~/icons_LEGACY'
import Box from '~/components/v0-legacy/atoms/Box'
import MyButton from '~/components/v0-legacy/MyButton'
import CameraView, { CameraOrientation, CameraRef } from '~/containers/CameraView'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/config'
import type { ReportStackParams } from '../../navigation/ReportStackNavigator'

export function Camera() {
  const insets = useSafeAreaInsets()
  const reportNavigation = useNavigation<StackNavigationProp<ReportStackParams, 'Camera'>>()
  const { params } = useRoute<RouteProp<ReportStackParams, 'Camera'>>()

  const cameraViewRef = useRef<CameraRef | null>(null)
  const [cameraIsReady, setCameraIsReady] = useState(false)
  const [cameraOrientation, setCameraOrientation] = useState<CameraOrientation>('back')

  const takePicture = useCallback(async () => {
    if (cameraViewRef.current === null) return
    try {
      const newCapturedPicture = await cameraViewRef.current.takePictureAsync()
      const previousCapturedMedias = params?.previousCapturedPictures || []
      reportNavigation.navigate('Medias', {
        capturedPictures: [...previousCapturedMedias, newCapturedPicture],
      })
    } catch (e) {
      console.error(e)
      Alert.alert('Unexpect error to take picture')
    }
  }, [params, reportNavigation])

  const closeCamera = useCallback(() => {
    reportNavigation.goBack()
  }, [reportNavigation])

  const flipCameraOrientation = useCallback(() => {
    setCameraOrientation((prev) => (prev === 'back' ? 'front' : 'back'))
  }, [])

  return (
    <Box flex={1}>
      <StatusBar barStyle={'light-content'} />
      <CameraView
        ref={cameraViewRef}
        style={styles.camera}
        orientation={cameraOrientation}
        onCameraReady={() => setCameraIsReady(true)}
      />
      <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
        <MyButton my={'sm'} icon={CloseIcon} onPress={closeCamera} />
        <MyButton my={'sm'} icon={RotateIcon} onPress={flipCameraOrientation} />
      </Box>
      {cameraIsReady && (
        <MyButton
          position="absolute"
          right="45%"
          bottom={insets.bottom + 30}
          onPress={takePicture}
        />
      )}
    </Box>
  )
}

// const startRecordingVideo = async () => {
//   if (cameraRef.current === null) return
//   try {
//     const r = await cameraRef.current.recordAsync()
//   } catch (e) {
//     console.error(e)
//   }
// }
// const stopRecordingVideo = async () => {
//   if (cameraRef.current === null) return
//   cameraRef.current.stopRecording()
// }

const styles = StyleSheet.create({
  camera: {
    backgroundColor: '#222',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
})
