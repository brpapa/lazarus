import request from 'supertest'
import { describe, it } from '@jest/globals'
import app from '../../app'

describe('POST /graphql', () => {
  it('query -> health', async () => {
    await request(app.callback())
      .post('/graphql')
      .send({
        query: '{ health }',
        variables: null,
      })
      .expect(200, { data: { health: 'It is alive!' } })
  })
})
