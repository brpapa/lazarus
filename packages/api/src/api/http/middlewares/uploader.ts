import type { Middleware } from 'koa'
import { parseFormData } from 'src/api/http/helpers/form-data-parser'
import { uploadToS3 } from 'src/api/http/helpers/s3-uploader'

export default function uploader(): Middleware {
  return async (ctx, next) => {
    if (!ctx.is('multipart/form-data')) next()

    const { files } = await parseFormData(ctx.req, uploadToS3)

    ctx.status = 200
    ctx.body = { files }
  }
}