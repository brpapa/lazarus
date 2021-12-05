import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import debug from 'debug'
import prettyBytes from 'pretty-bytes'
import { hrtime } from 'process'
import { AWS_SERVICE_ENDPOINT, AWS_REGION, AWS_S3_BUCKET_NAME } from 'src/shared/config'
import { Readable } from 'stream'
import { FileMetadata } from './form-data-parser'

const log = debug('app:uploader')

/**
 * pipe the incoming file stream to the S3
 * @see [s3-multipart-upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
 * @see [aws-lib-storage](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_storage.html)
 */
export async function uploadToS3(incomingFile: Readable, fileMetadata: FileMetadata) {
  const s3Client = new S3Client({
    region: AWS_REGION,
    endpoint: AWS_SERVICE_ENDPOINT,
  })

  registerDownloadProgressReporter(incomingFile, fileMetadata)

  try {
    // at most queueSize * partSize bytes will be buffered in memory
    const upload = new Upload({
      client: s3Client,
      queueSize: 1, // no parallel
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: true,
      params: {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: `${Date.now().toString(16)}-${fileMetadata.fileName}`,
        Body: incomingFile,
        ContentEncoding: fileMetadata.transferEncoding,
        ContentType: fileMetadata.mimeType,
      },
    })

    upload.on('httpUploadProgress', (progress) => {
      if (progress.loaded)
        log(`${fileMetadata.fileName}: ${prettyBytes(progress.loaded)} uploaded to the S3`)
    })

    await upload.done()
    log(`${fileMetadata.fileName}: totally uploaded to the S3`)
  } catch (e) {
    log(`${fileMetadata.fileName}: error to upload to the S3`, e)
  }
}

const registerDownloadProgressReporter = (incomingFile: Readable, fileMetadata: FileMetadata) => {
  let consumedBytes = 0
  let previousClientUpdateTickInNs: bigint | null = null

  incomingFile.on('data', (chunk) => {
    consumedBytes += chunk.length
    // backpressure the client update
    if (canUpdateClientNow(previousClientUpdateTickInNs)) {
      previousClientUpdateTickInNs = hrtime.bigint()
      log(`${fileMetadata.fileName}: ${prettyBytes(consumedBytes)} downloaded by server`) // TODO: notificar cliente via websocket
    }
  })
  incomingFile.on('end', () => {
    log(`${fileMetadata.fileName}: totally downloaded by server`)
  })
}

function canUpdateClientNow(previousTickInNs: bigint | null) {
  if (previousTickInNs === null) return true
  const MINIMAL_CLIENT_UPDATE_PERIOD_IN_MS = 300
  const nowTickInNs = hrtime.bigint()
  const minimalAllowedPeriodInMs = MINIMAL_CLIENT_UPDATE_PERIOD_IN_MS * 1e6
  return nowTickInNs - previousTickInNs >= minimalAllowedPeriodInMs
}
