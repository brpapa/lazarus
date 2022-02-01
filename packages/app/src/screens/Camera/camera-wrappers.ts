import { Camera } from 'expo-camera'
import * as FileSystem from 'expo-file-system'
import { MediaTypeEnum } from '~/shared/constants'
import type { CapturedMedia } from '~/types'
import { VIDEO_RECORD_MAX_DURATION_S } from '../../shared/constants'

export const getTakePicture = (camera: Camera | null) =>
  camera instanceof Camera ? takePicture(camera) : takePictureMocked

export const getStartRecording = (camera: Camera | null) =>
  camera instanceof Camera ? startRecording(camera) : startRecordingMocked

function takePicture(camera: Camera): () => Promise<CapturedMedia> {
  return async () => {
    const pic = await camera.takePictureAsync({ exif: true, base64: true })
    // TODO: pic.exif contains the propriertes:
    // "DateTimeDigitized": "2021:12:11 20:02:25",
    // "DateTimeOriginal": "2021:12:11 20:02:25",
    // "OffsetTime": "-03:00",
    // "OffsetTimeDigitized": "-03:00",
    // "OffsetTimeOriginal": "-03:00",
    return {
      id: extractId(pic.uri),
      type: MediaTypeEnum.IMAGE,
      uri: pic.uri,
      width: pic.width,
      height: pic.height,
      mimeType: base64ToMimeType(pic.base64),
      extension: pic.uri.split('.').pop(),
    }
  }
}

function startRecording(camera: Camera): () => Promise<CapturedMedia> {
  return async () => {
    const { uri } = await camera.recordAsync({
      maxDuration: VIDEO_RECORD_MAX_DURATION_S,
      // quality: Camera.Constants.VideoQuality['480p'],
    })
    return {
      id: extractId(uri),
      type: MediaTypeEnum.VIDEO,
      uri: uri,
      extension: uri.split('.').pop(),
    }
  }
}

/** download a random file from internet and save to file system */
export async function takePictureMocked(): Promise<CapturedMedia> {
  const fakeJpgPicture = () => {
    const width = Math.ceil(Math.random() * 6) * 120
    const height = Math.ceil(Math.random() * 6) * 120
    return { remoteUri: `https://placekitten.com/${width}/${height}`, width, height }
  }

  const pic = fakeJpgPicture()
  const localUri = `${FileSystem.documentDirectory}/${Date.now().toString(16)}.jpg`
  const result = await FileSystem.downloadAsync(pic.remoteUri, localUri)
  const mimeType = result.mimeType ?? undefined

  return {
    id: extractId(localUri),
    type: MediaTypeEnum.IMAGE,
    uri: localUri,
    width: pic.width,
    height: pic.height,
    mimeType,
    extension: localUri.split('.').pop(),
  }
}

export async function startRecordingMocked(): Promise<CapturedMedia> {
  const uri = 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'
  await new Promise((res) => setTimeout(res, 1000))
  return {
    id: Date.now().toString(16),
    type: MediaTypeEnum.VIDEO,
    uri,
    width: 480,
    height: 270,
    mimeType: 'video/mp4',
    extension: uri.split('.').pop(),
  }
}

function base64ToMimeType(encodedBase64?: string) {
  // const DEFAULT_MIME_TYPE = 'application/octet-stream'

  if (typeof encodedBase64 !== 'string') return undefined

  const results = encodedBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (results && results.length) return results[1]

  return undefined
}

const extractId = (uri: string) => {
  const [fileName] = uri.split('/').reverse()
  if (!fileName) throw new Error(`Unexpected fileName, received: ${fileName}`)
  const [id] = fileName.split('.')
  if (!id) throw new Error(`Unexpected id, received: ${id}`)
  return id
}
