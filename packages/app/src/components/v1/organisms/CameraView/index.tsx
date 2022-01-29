import { Camera as BaseCamera } from 'expo-camera'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { ENABLE_CAMERA_MOCK } from '~/config'
import { mockedTakePictureAsync } from './mocks'

export interface CameraViewRef {
  /** take a picture and saved it to app's cache directory */
  takePictureAsync: () => Promise<CapturedPicture>
  pausePreview: () => void
  resumePreview: () => void
}

export type CameraViewProps = {
  style: StyleProp<ViewStyle>
  onCameraReady: () => void
  orientation: CameraOrientation
}
export type CameraOrientation = 'back' | 'front'

/** A wrapper around the Camera component to mock Camera when {@link ENABLE_CAMERA_MOCK} is true */
export const CameraView = forwardRef<CameraViewRef, CameraViewProps>((props, ref) => {
  const baseCameraRef = useRef<BaseCamera | null>(null)

  useEffect(() => {
    if (ENABLE_CAMERA_MOCK) setTimeout(props.onCameraReady, 300)
  }, [props.onCameraReady])

  // customize the exposed ref
  useImperativeHandle(ref, () => ({
    takePictureAsync:
      baseCameraRef?.current instanceof BaseCamera
        ? wrappedTakePictureAsync(baseCameraRef!.current)
        : mockedTakePictureAsync,
    pausePreview:
      baseCameraRef?.current instanceof BaseCamera ? baseCameraRef.current.pausePreview : emptyFn,
    resumePreview:
      baseCameraRef?.current instanceof BaseCamera ? baseCameraRef.current.resumePreview : emptyFn,
  }))

  return (
    <>
      {!ENABLE_CAMERA_MOCK ? (
        <BaseCamera
          ref={baseCameraRef}
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

const cameraOrientationMap = {
  back: BaseCamera.Constants.Type.back,
  front: BaseCamera.Constants.Type.front,
}

const emptyFn = () => {}

function wrappedTakePictureAsync(camera: BaseCamera): () => Promise<CapturedPicture> {
  return async () => {
    const pic = await camera.takePictureAsync({ exif: true, base64: true })
    const extension = pic.uri.split('.').pop()
    // TODO: pic.exif contains the propriertes:
    // "DateTimeDigitized": "2021:12:11 20:02:25",
    // "DateTimeOriginal": "2021:12:11 20:02:25",
    // "OffsetTime": "-03:00",
    // "OffsetTimeDigitized": "-03:00",
    // "OffsetTimeOriginal": "-03:00",
    return {
      uri: pic.uri,
      width: pic.width,
      height: pic.height,
      mimeType: base64ToMimeType(pic.base64),
      extension,
    }
  }
}

function base64ToMimeType(encodedBase64?: string) {
  // const DEFAULT_MIME_TYPE = 'application/octet-stream'

  if (typeof encodedBase64 !== 'string') return undefined

  const results = encodedBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (results && results.length) return results[1]

  return undefined
}
