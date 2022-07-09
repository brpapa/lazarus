import FormData from 'form-data'
import { SERVER_HTTP_BASE_URL } from '@env'
import { MediaTypeEnum } from '~/shared/constants'
import type { CapturedMedia } from '../types'

type ResponseBody = {
  files: Record<
    string,
    {
      fileName: string
      mimeType: string
      s3Url: string
      transferEncoding: string
    }
  >
}

export const uploadMedias = async (medias: CapturedMedia[]): Promise<ResponseBody['files']> => {
  const formData = medias.reduce<FormData>((acc, media) => {
    const fieldName = media.id // id controlado pelo front pra saber ler o retorno
    const fileName = media.extension
      ? `${MediaTypeEnum[media.type]}-${media.id}.${media.extension}`
      : fieldName

    acc.append(
      fieldName,
      { uri: media.uri, name: fileName },
      { contentType: media.mimeType, filename: fileName },
    )
    return acc
  }, new FormData())

  const response = await fetch(`${SERVER_HTTP_BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
  const responseBody = (await response.json()) as ResponseBody
  return responseBody.files
}
