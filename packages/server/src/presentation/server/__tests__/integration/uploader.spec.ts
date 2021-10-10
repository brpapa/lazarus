import { describe, it, beforeEach, jest } from '@jest/globals'
import request from 'supertest'
import fs from 'fs'
import { join } from 'path'
import debug from 'debug'
import app from '../../app'

const log = debug('test:uploader')

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn())
})

jest.setTimeout(10 * 60 * 1000)

describe('post /uploads', () => {
  it('should upload a file', async () => {
    await request(app.callback())
      .post('/uploads')
      .set('Content-Type', 'multipart/form-data')
      .query({ socketId: '01' })
      .field('fieldname', 'fieldvalue')
      // .attach('textFile', fs.createReadStream(join(__dirname, '..', 'mocks', 'text.txt')))
      // .attach('imageFile', fs.createReadStream(join(__dirname, '..', 'mocks', 'image.jpg')))
      .attach('videoFile', fs.createReadStream(join(__dirname, '..', 'mocks', 'video.mov')))
      // .attach('bigFile', fs.createReadStream(join(__dirname, '..', 'mocks', 'big.file')))
      // .expect('Content-Type', /image\/jpeg/)
      .expect(200)
    log('http request: closed')
  })
})
