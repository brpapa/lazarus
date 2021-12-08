import React, { useState, useRef, useCallback } from 'react'
import { Alert, StatusBar, StyleSheet } from 'react-native'
import Camera, { CameraOrientation, CameraRef } from '~/containers/Camera'
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ReportStackParams } from '.'
import Shutter from '~/components/Shutter'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon, RotateIcon } from '~/assets/icons'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/shared/config'
import { XStack, Button } from '~/components/atomics'

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
    if (cameraRef.current === null) {
      console.warn('Camera is not ready yet')
      return
    }
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

  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      cameraRef.current && cameraRef.current.resumePreview()
      return () => {
        // when the screen is unfocused
        cameraRef.current && cameraRef.current.pausePreview()
      }
    }, []),
  )

  return (
    <XStack flex={1}>
      <StatusBar barStyle={'light-content'} />
      <Camera
        ref={cameraRef}
        style={styles.camera}
        orientation={cameraOrientation}
        onCameraReady={() => setCameraIsReady(true)}
      />
      <XStack position="absolute" right={insets.right + 10} top={insets.top + 10}>
        <Button my="$1" icon={CloseIcon} onPress={closeCamera} />
        <Button my="$1" icon={RotateIcon} onPress={flipCameraOrientation} />
      </XStack>
      {cameraIsReady && <Shutter style={styles.shutter} onClick={takePicture} />}
    </XStack>
  )
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: '#222',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  shutter: {
    position: 'absolute',
    right: '45%',
    bottom: 30,
  },
})
