import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/core'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Camera as ExpoCamera } from 'expo-camera'
import React, { useCallback, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ENABLE_CAMERA_MOCK } from '~/config'
import { useIsForeground } from '~/hooks/use-is-foreground'
import type { ReportStackNavProp, ReportStackRouteProp } from '~/navigation/types'
import { CONTENT_SPACING, SAFE_AREA_PADDING } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { CapturedMedia } from '~/types'
import { CameraMock } from './CameraMock'
import { CaptureButton } from './CaptureButton'

const BUTTON_SIZE = 40

export function Camera() {
  const s = useStyles()
  const nav = useNavigation<ReportStackNavProp<'Camera'>>()
  const { params } = useRoute<ReportStackRouteProp<'Camera'>>()

  const cameraRef = useRef<ExpoCamera>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  // check if camera page is active
  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

  const [cameraOrientation, setCameraOrientation] = useState<CameraOrientation>('back')
  const [enableHdr, setEnableHdr] = useState(false)
  const [flash, setFlash] = useState<FlashMode>('off')
  const [enableNightMode, setEnableNightMode] = useState(false)

  // #region Callbacks

  const onCameraReady = useCallback(() => {
    setIsCameraReady(true)
  }, [])

  const onMediaCaptured = useCallback(
    (media: CapturedMedia) => {
      console.log(`Media captured! ${JSON.stringify(media)}`)
      const previousCapturedMedias = params?.previousCapturedMedias || []
      nav.navigate('MediasReview', {
        capturedMedias: [...previousCapturedMedias, media],
      })
    },
    [nav, params],
  )

  const onFlipCameraPressed = useCallback(() => {
    setCameraOrientation((p) => (p === 'back' ? 'front' : 'back'))
  }, [])

  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'))
  }, [])

  // #endregion

  return (
    <View style={s.container}>
      {!ENABLE_CAMERA_MOCK ? (
        <ExpoCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          onCameraReady={onCameraReady}
          flashMode={flash}
          type={cameraOrientationMap[cameraOrientation]}
        />
      ) : (
        <CameraMock onCameraReady={onCameraReady} />
      )}

      <CaptureButton
        cameraRef={cameraRef}
        style={s.captureButton}
        onMediaCaptured={onMediaCaptured}
        enabled={isCameraReady && isActive}
      />

      <View style={s.rightButtonRow}>
        <TouchableOpacity style={s.button} onPress={nav.goBack}>
          <Ionicons name="close" color="white" size={24} />
        </TouchableOpacity>
      </View>
      <View style={s.leftButtonRow}>
        <TouchableOpacity style={s.button} onPress={onFlipCameraPressed}>
          <Ionicons name="camera-reverse" color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={onFlashPressed}>
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={() => setEnableHdr((h) => !h)}>
          <MaterialCommunityIcons name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={() => setEnableNightMode(!enableNightMode)}>
          <Ionicons name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ insets }) => ({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom(insets),
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight(insets),
    top: SAFE_AREA_PADDING.paddingTop(insets),
  },
  leftButtonRow: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft(insets),
    top: SAFE_AREA_PADDING.paddingTop(insets),
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}))

const cameraOrientationMap = {
  back: ExpoCamera.Constants.Type.back,
  front: ExpoCamera.Constants.Type.front,
}

type CameraOrientation = 'back' | 'front'
type FlashMode = 'off' | 'on'
