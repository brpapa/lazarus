import * as FileSystem from 'expo-file-system'
import type { CameraRef } from './index'

const jpgPictureUrl = () => {
  const size = Math.ceil(Math.random() * 6) * 120
  return `https://placekitten.com/${size}/${size}`
}

/** download a random file from internet and save to file system */
export const mockedTakePictureAsync: CameraRef['takePictureAsync'] = async () => {
  const fileUri = `${FileSystem.documentDirectory}/${Date.now().toString(16)}.jpg`
  await FileSystem.downloadAsync(jpgPictureUrl(), fileUri)
  return { uri: fileUri }
}
