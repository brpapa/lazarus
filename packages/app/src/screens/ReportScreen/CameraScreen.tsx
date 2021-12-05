import React, { useState, useRef, useCallback } from 'react'
import { Alert, StatusBar, StyleSheet } from 'react-native'
import Camera, { CameraOrientation, CameraRef } from '~/containers/Camera'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ReportStackParams } from '.'
import Box from '~/components/atomics/Box'
import RoundedButton from '~/components/RoundedButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon, RotateIcon } from '~/assets/icons'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/shared/config'

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

export default function CameraScreen() {
  const reportNavigation = useNavigation<StackNavigationProp<ReportStackParams, 'Camera'>>()
  const { params } = useRoute<RouteProp<ReportStackParams, 'Camera'>>()

  const cameraRef = useRef<CameraRef | null>(null)
  const [cameraIsReady, setCameraIsReady] = useState(false)
  const [cameraOrientation, setCameraOrientation] = useState<CameraOrientation>('back')

  const insets = useSafeAreaInsets()

  const takePicture = useCallback(async () => {
    if (cameraRef.current === null) return
    try {
      // picture is saved in app's cache directory
      const pic = await cameraRef.current.takePictureAsync({ exif: true })
      // console.log(pic.exif?.DateTimeOriginal + pic.exif?.OffsetTimeOriginal)

      const capturedMedia = {
        uri: `file://${pic.uri}`,
      }
      const newCapturedMedias = [...(params?.previousCapturedMedias || []), capturedMedia]
      reportNavigation.navigate('Medias', { capturedMedias: newCapturedMedias })
    } catch (e) {
      console.error(e)
      Alert.alert('Unexpect error to take a picture')
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
      <Camera
        ref={cameraRef}
        style={styles.camera}
        orientation={cameraOrientation}
        onCameraReady={() => setCameraIsReady(true)}
      />
      <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
        <RoundedButton my={'sm'} icon={CloseIcon} onPress={closeCamera} />
        <RoundedButton my={'sm'} icon={RotateIcon} onPress={flipCameraOrientation} />
      </Box>
      {cameraIsReady && (
        <RoundedButton
          position="absolute"
          right="45%"
          bottom={insets.bottom + 30}
          onPress={takePicture}
        />
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: '#222',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
})
