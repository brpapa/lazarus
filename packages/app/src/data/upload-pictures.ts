import FormData from 'form-data'
import { MediaType } from '~/shared/constants'
import { HTTP_SERVER_BASE_URL } from '~/config'

type UploadResponseBody = {
  files: {
    s3Url: string
  }[]
}

export const uploadPictures = async (medias: CapturedPicture[]): Promise<{ s3Url: string }[]> => {
  const formData = medias.reduce<FormData>((acc, media, i) => {
    const fieldName = `${MediaType.IMAGE}-${i}`
    const fileName = media.extension ? `${fieldName}.${media.extension}` : fieldName
    acc.append(
      fieldName,
      { uri: media.uri, name: fileName },
      { contentType: media.mimeType, filename: fileName },
    )
    return acc
  }, new FormData())

  const response = await fetch(`${HTTP_SERVER_BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
  const responseBody = (await response.json()) as UploadResponseBody
  return responseBody.files
}
