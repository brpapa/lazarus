import { StyleProp, View, ViewStyle } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Camera, CameraCapturedPicture, CameraPictureOptions } from 'expo-camera'
import { ENABLE_CAMERA } from '~/shared/config'
import { mockedTakePictureAsync } from './mocks'

export interface CameraProps {
  style: StyleProp<ViewStyle>
  onCameraReady: () => void
  orientation: CameraOrientation
}
export interface CameraRef {
  takePictureAsync: (options?: CameraPictureOptions) => Promise<CapturedPicture>
  pausePreview: () => void
  resumePreview: () => void
}
export type CameraOrientation = 'back' | 'front'
export type CapturedPicture = CameraCapturedPicture | { uri: string }

/** A wrapper around the Camera component which it will be mocked when {@link ENABLE_CAMERA} is false */
const CameraWrapper = forwardRef<CameraRef, CameraProps>((props, ref) => {
  const cameraRef = useRef<Camera | null>(null)

  useEffect(() => {
    if (!ENABLE_CAMERA) setTimeout(props.onCameraReady, 300)
  }, [ENABLE_CAMERA, props.onCameraReady])

  // customize the exposed ref
  useImperativeHandle(ref, () => ({
    takePictureAsync:
      cameraRef?.current instanceof Camera
        ? cameraRef.current.takePictureAsync
        : mockedTakePictureAsync,
    pausePreview: cameraRef?.current instanceof Camera ? cameraRef.current.pausePreview : emptyFn,
    resumePreview: cameraRef?.current instanceof Camera ? cameraRef.current.resumePreview : emptyFn,
  }))

  return (
    <>
      {ENABLE_CAMERA ? (
        <Camera
          ref={cameraRef}
          onCameraReady={props.onCameraReady}
          style={props.style}
          type={cameraOrientationMap[props.orientation]}
        />
      ) : (
        <View style={props.style} />
      )}
    </>
  )
})

export default CameraWrapper

const cameraOrientationMap = {
  back: Camera.Constants.Type.back,
  front: Camera.Constants.Type.front,
}

const emptyFn = () => {}
