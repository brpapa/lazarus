import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { Alert, StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FloatingButton } from '~/components/v1/atoms'
import CameraView, { CameraOrientation, CameraRef } from '~/components/v1/organisms/CameraView'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/config'
import type { ReportStackNavProp, ReportStackRouteProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'

export function Camera() {
  const s = useStyles()
  const insets = useSafeAreaInsets()
  const nav = useNavigation<ReportStackNavProp<'Camera'>>()
  const { params } = useRoute<ReportStackRouteProp<'Camera'>>()

  const cameraViewRef = useRef<CameraRef | null>(null)
  const [cameraIsReady, setCameraIsReady] = useState(false)
  const [cameraOrientation, setCameraOrientation] = useState<CameraOrientation>('back')

  const takePicture = useCallback(async () => {
    if (cameraViewRef.current === null) return
    try {
      const newCapturedPicture = await cameraViewRef.current.takePictureAsync()
      const previousCapturedMedias = params?.previousCapturedPictures || []
      nav.navigate('Medias', {
        capturedPictures: [...previousCapturedMedias, newCapturedPicture],
      })
    } catch (e) {
      console.error(e)
      Alert.alert('Unexpect error to take picture')
    }
  }, [params, nav])

  const closeCamera = useCallback(() => {
    nav.goBack()
  }, [nav])

  const flipCameraOrientation = useCallback(() => {
    setCameraOrientation((prev) => (prev === 'back' ? 'front' : 'back'))
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'light-content'} />
      <CameraView
        ref={cameraViewRef}
        style={s.camera}
        orientation={cameraOrientation}
        onCameraReady={() => setCameraIsReady(true)}
      />
      <View style={{ position: 'absolute', right: insets.right + 10, top: insets.top + 10 }}>
        <FloatingButton icon={'Close'} onPress={closeCamera} style={s.button} />
        <FloatingButton icon={'Rotate'} onPress={flipCameraOrientation} style={s.button} />
      </View>
      {cameraIsReady && (
        <FloatingButton
          icon="Camera"
          onPress={takePicture}
          style={{ position: 'absolute', right: '45%', bottom: insets.bottom + 30 }}
        />
      )}
    </View>
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

const useStyles = makeUseStyles(({ spacing }) => ({
  camera: {
    backgroundColor: '#222',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  button: {
    marginTop: spacing.m,
    marginBottom: spacing.m,
  },
}))
