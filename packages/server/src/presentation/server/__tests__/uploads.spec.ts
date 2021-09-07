import request from 'supertest'
import { describe, it } from '@jest/globals'
import app from '../app'

describe('POST /uploads', () => {
  it('should exists', async () => {
    await request(app.callback())
      .post('/uploads')
      .expect('Content-Type', /text\/plain/)
      .expect(200)
  })
})
