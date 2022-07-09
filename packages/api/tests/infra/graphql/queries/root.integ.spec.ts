import request from 'supertest'
import { app } from 'src/api/http/app'

describe('graphql query: root', () => {
  test('it should get the health', async () => {
    await request(app.callback())
      .post('/graphql')
      .send({
        query: '{ health }',
        variables: null,
      })
      .expect(200, { data: { health: 'It is alive!' } })
  })
})
