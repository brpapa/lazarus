import type { Middleware } from 'koa'
import { parseFormData } from 'src/infra/http/utils/form-data-parser'
import { uploadToS3 } from 'src/infra/http/utils/s3-uploader'

export default function uploader(): Middleware {
  return async (ctx, next) => {
    if (!ctx.is('multipart/form-data')) next()

    const { fields } = await parseFormData(ctx.req, { onFile: uploadToS3 })

    ctx.status = 200
    ctx.body = { message: 'Uploaded', fields }
  }
}
