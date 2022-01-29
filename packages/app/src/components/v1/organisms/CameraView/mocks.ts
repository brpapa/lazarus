import * as FileSystem from 'expo-file-system'

const fakeJpgPicture = () => {
  const width = Math.ceil(Math.random() * 6) * 120
  const height = Math.ceil(Math.random() * 6) * 120
  return { remoteUri: `https://placekitten.com/${width}/${height}`, width, height }
}

/** download a random file from internet and save to file system */
export async function mockedTakePictureAsync(): Promise<CapturedPicture> {
  const pic = fakeJpgPicture()
  const localUri = `${FileSystem.documentDirectory}/${Date.now().toString(16)}.jpg`
  const result = await FileSystem.downloadAsync(pic.remoteUri, localUri)
  const mimeType = result.mimeType ?? undefined
  return {
    uri: localUri,
    width: pic.width,
    height: pic.height,
    mimeType,
    extension: localUri.split('.').pop(),
  }
}
