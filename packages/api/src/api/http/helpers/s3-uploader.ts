import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import debug from 'debug'
import prettyBytes from 'pretty-bytes'
import { hrtime } from 'process'
import { AWS_SERVICE_ENDPOINT, AWS_REGION, AWS_S3_BUCKET_NAME } from 'src/config'
import { UUID } from '@shared/domain/models/uuid'
import { Readable } from 'stream'
import { FileMetadata } from './form-data-parser'

const log = debug('app:infra:http')

export type UploadResult = {
  s3Url: string
} & FileMetadata

/**
 * pipe the incoming file stream to the S3
 * @see [s3-multipart-upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
 * @see [aws-lib-storage](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_storage.html)
 */
export async function uploadToS3(
  incomingFile: Readable,
  metadata: FileMetadata,
): Promise<UploadResult> {
  const s3Client = new S3Client({
    region: AWS_REGION,
    endpoint: AWS_SERVICE_ENDPOINT,
  })
  const objectKey = createObjectKey(metadata)
  registerDownloadProgressReporter(incomingFile, metadata)

  try {
    // at most queueSize * partSize bytes will be buffered in memory
    const upload = new Upload({
      client: s3Client,
      queueSize: 1, // no parallel
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: true,
      params: {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: incomingFile,
        ContentEncoding: metadata.transferEncoding,
        ContentType: metadata.mimeType,
      },
    })

    upload.on('httpUploadProgress', (progress) => {
      if (progress.loaded)
        log(`%o file: %s uploaded to the S3`, metadata.fileName, prettyBytes(progress.loaded))
    })

    await upload.done()
    log(`%o file: totally uploaded to the S3`, metadata.fileName)

    const s3Url = `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`
    return { s3Url, ...metadata }
  } catch (e) {
    log(`%o file: error to upload to the S3`, metadata.fileName)
    throw e
  }
}

const registerDownloadProgressReporter = (incomingFile: Readable, metadata: FileMetadata) => {
  let consumedBytes = 0
  let previousClientUpdateTickInNs: bigint | null = null

  incomingFile.on('data', (chunk) => {
    consumedBytes += chunk.length
    // backpressure the client update
    if (canUpdateClientNow(previousClientUpdateTickInNs)) {
      previousClientUpdateTickInNs = hrtime.bigint()
      log(`%o file: %s downloaded by server`, metadata.fileName, prettyBytes(consumedBytes)) // TODO: notificar cliente via websocket
    }
  })
  incomingFile.on('end', () => {
    log(`%o file: totally downloaded by server`, metadata.fileName)
  })
}

function canUpdateClientNow(previousTickInNs: bigint | null) {
  if (previousTickInNs === null) return true
  const MINIMAL_CLIENT_UPDATE_PERIOD_IN_MS = 300
  const nowTickInNs = hrtime.bigint()
  const minimalAllowedPeriodInMs = MINIMAL_CLIENT_UPDATE_PERIOD_IN_MS * 1e6
  return nowTickInNs - previousTickInNs >= minimalAllowedPeriodInMs
}

const createObjectKey = (metadata: FileMetadata) => {
  const uuid = new UUID().toString()
  const extension = metadata.fileName.split('.').pop()
  return extension ? `${uuid}.${extension}` : uuid
}
