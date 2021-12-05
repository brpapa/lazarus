import request from 'supertest'
import fs from 'fs'
import path from 'path'
import debug from 'debug'
import { app } from '../../src/infra/http/app'
import * as s3Uploader from '../../src/infra/http/utils/s3-uploader'

const log = debug('test:uploader')

const fromMocksDir = path.join.bind(__dirname, '..', '..', '__mocks__')
jest.setTimeout(10 * 60 * 1000)

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn())
})

describe('POST /uploads', () => {
  test('server should, for each file received from request, call the s3 uploader', async () => {
    jest.spyOn(s3Uploader, 'uploadToS3').mockImplementation((incomingFile, _) => {
      return new Promise((res, rej) => incomingFile.resume().on('end', res).on('error', rej))
    })

    await request(app.callback())
      .post('/uploads')
      .set('Content-Type', 'multipart/form-data')
      .query({ socketId: '01' })
      .field('fieldname', 'fieldvalue')
      .attach('textFile', fs.createReadStream(fromMocksDir('text.txt')))
      .attach('imageFile', fs.createReadStream(fromMocksDir('image.jpg')))
      // .attach('videoFile', fs.createReadStream(join(__dirname, '..', 'mocks', 'video.mov')))
      // .expect('Content-Type', /image\/jpeg/)
      .expect(200)

    expect(s3Uploader.uploadToS3).toHaveBeenCalledTimes(2)

    log('http request: closed')
  })
})
