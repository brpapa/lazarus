import { Camera } from 'expo-camera'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { ENABLE_CAMERA_MOCK } from '~/shared/config'
import { mockedTakePictureAsync } from './mocks'

export interface CameraProps {
  style: StyleProp<ViewStyle>
  onCameraReady: () => void
  orientation: CameraOrientation
}
export interface CameraRef {
  /** take a picture and saved it to app's cache directory */
  takePictureAsync: () => Promise<CapturedPicture>
  pausePreview: () => void
  resumePreview: () => void
}
export type CameraOrientation = 'back' | 'front'
export type CapturedPicture = {
  /** path in device file system where the picture was saved */
  uri: string
  width: number
  height: number
  mimeType?: string
  extension?: string
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

/** A wrapper around the Camera component which it will be mocked when {@link ENABLE_CAMERA_MOCK} is true */
const CameraWrapper = forwardRef<CameraRef, CameraProps>((props, ref) => {
  const cameraRef = useRef<Camera | null>(null)

  useEffect(() => {
    if (ENABLE_CAMERA_MOCK) setTimeout(props.onCameraReady, 300)
  }, [props.onCameraReady])

  // customize the exposed ref
  useImperativeHandle(ref, () => ({
    takePictureAsync:
      cameraRef?.current instanceof Camera
        ? wrappedTakePictureAsync(cameraRef!.current)
        : mockedTakePictureAsync,
    pausePreview: cameraRef?.current instanceof Camera ? cameraRef.current.pausePreview : emptyFn,
    resumePreview: cameraRef?.current instanceof Camera ? cameraRef.current.resumePreview : emptyFn,
  }))

  return (
    <>
      {!ENABLE_CAMERA_MOCK ? (
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

function wrappedTakePictureAsync(camera: Camera): () => Promise<CapturedPicture> {
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
