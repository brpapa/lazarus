import type { Middleware } from 'koa'
import { parseFormData } from 'src/api/http/helpers/form-data-parser'
import { uploadToS3 } from 'src/api/http/helpers/s3-uploader'

export default function uploader(): Middleware {
  return async (ctx, next) => {
    if (!ctx.is('multipart/form-data')) next()

    const { files: rawFiles } = await parseFormData(ctx.req, uploadToS3)

    // group by fieldName
    const files = rawFiles.reduce<any>((acc, file) => {
      acc[file.fieldName] = {
        fileName: file.fileName,
        mimeType: file.mimeType,
        s3Url: file.s3Url,
        transferEncoding: file.transferEncoding,
      }
      return acc
    }, {})

    ctx.status = 200
    ctx.body = { files }
  }
}
