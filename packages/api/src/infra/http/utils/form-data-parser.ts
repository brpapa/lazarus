import Busboy from 'busboy'
import debug from 'debug'
import { IncomingMessage } from 'http'
import { Readable } from 'stream'

const log = debug('app:form-data-parser')

export type FileMetadata = {
  /** formdata field */
  fieldName: string
  fileName: string
  transferEncoding: string
  mimeType: string
}

type ParsedFormData<T> = { files: T[] }

export function parseFormData<T>(
  request: IncomingMessage,
  /** the file stream must be consumed, otherwise it will never ends */
  fileHandler: (file: Readable, metadata: FileMetadata) => Promise<T>,
): Promise<ParsedFormData<T>> {
  // a parser of xml formdata received from http to node stream
  const busboyWritable = new Busboy({ headers: request.headers })

  return new Promise((resolve, reject) => {
    const fields: Record<string, any> = {}
    const fileHandlerPromises: Promise<T>[] = []

    request.on('close', cleanup)

    busboyWritable
      .on('field', onField) // when a formdata field is find
      .on('file', onFile) // when a formdata file is find
      .on('finish', onEnd) // when the last chunk of the last file was loaded in memory (not uploaded yet)
      .on('error', onError)
      .on('partsLimit', onError.bind(null, new Error('Reach parts limit')))
      .on('filesLimit', onError.bind(null, new Error('Reach files limit')))
      .on('fieldsLimit', onError.bind(null, new Error('Reach fields limit')))

    // pipe the incoming request into the busboy writable (with all listeners already registered)
    request.pipe(busboyWritable)

    // FIXME
    function onField(
      fieldName: string,
      value: string,
      fieldNameTruncated: boolean,
      valueTruncated: boolean,
      encoding: string,
      mimeType: string,
    ) {
      // don't overwrite prototypes
      if (Object.getOwnPropertyDescriptor(Object.prototype, fieldName)) return

      // this looks like a stringified array, so let's parse it
      if (fieldName.indexOf('[') > -1) {
        const obj = objectFromBluePrint(extractFormData(fieldName), value)
        reconcile(obj, fields)
      } else if (fieldName in fields) {
        if (Array.isArray(fields[fieldName])) {
          fields[fieldName].push(value)
        } else {
          fields[fieldName] = [fields[fieldName], value]
        }
      } else {
        fields[fieldName] = value
      }
    }

    async function onFile(
      fieldName: string,
      incomingFile: Readable,
      fileName: string,
      transferEncoding: string,
      mimeType: string,
    ) {
      const fileMetadata = {
        fieldName,
        fileName,
        transferEncoding,
        mimeType,
      }
      log('file received: ', fileMetadata)

      const fileHandlerPromise = fileHandler(incomingFile, fileMetadata)
      fileHandlerPromises.push(fileHandlerPromise)
    }

    function onError(err: Error) {
      cleanup()
      reject(err)
    }

    function onEnd(err: Error) {
      if (err) reject(err)
      else {
        Promise.all(fileHandlerPromises)
          .then((uploadResults) => {
            cleanup()
            resolve({ files: uploadResults })
          })
          .catch(reject)
      }
    }

    function cleanup() {
      busboyWritable.removeListener('field', onField)
      busboyWritable.removeListener('file', onFile)
      busboyWritable.removeListener('finish', onEnd)
      busboyWritable.removeListener('error', onError)
      busboyWritable.removeListener('partsLimit', onError)
      busboyWritable.removeListener('filesLimit', onError)
      busboyWritable.removeListener('fieldsLimit', onError)
    }
  })
}

/**
 * Extract a hierarchy array from a stringified formData single input.
 * i.e. topLevel[sub1][sub2] => [topLevel, sub1, sub2]
 */
const extractFormData = (fieldName: string) => {
  const arr = fieldName.split('[')
  const first = arr.shift()
  const res = arr.map((v) => v.split(']')[0])
  if (first) res.unshift(first)
  return res
}

/**
 * Generate an object given an hierarchy blueprint and the value
 * i.e. [key1, key2, key3] => { key1: {key2: { key3: value }}};
 */
const objectFromBluePrint = (arr: string[], value: any) => {
  return arr.reverse().reduce((acc, next) => {
    if (Number(next).toString() === 'NaN') {
      return { [next]: acc }
    }
    const newAcc = []
    newAcc[Number(next)] = acc
    return newAcc
  }, value)
}

/**
 * Reconciles formatted data with already formatted data
 * @param  {Object} obj extractedObject
 * @param  {Object} target the field object
 * @return {Object} reconciled fields
 */
const reconcile = (obj: any, target: any): any => {
  const key = Object.keys(obj)[0]
  const val = obj[key]

  // The reconciliation works even with array has
  // Object.keys will yield the array indexes
  // see https://jsbin.com/hulekomopo/1/
  // Since array are in form of [ , , valu3] [value1, value2]
  // the final array will be: [value1, value2, value3] has expected
  if (key in target) {
    return reconcile(val, target[key])
  }
  target[key] = val
  return target[key]
}
