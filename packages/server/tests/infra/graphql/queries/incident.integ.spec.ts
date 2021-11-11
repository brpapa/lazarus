import request from 'supertest'
import { app } from 'src/infra/http/app'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'

describe('graphql queries: incident', () => {
  beforeAll(connectDataSources)
  beforeEach(cleanUpDatasources)
  afterAll(disconnectDatasources)

  test('it should get a incident', async () => {
    // await createUser('user-id')
    // await createIncident('my-existing-incident-id', 'user-id')

    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query: `{
          incident(id: "my-existing-incident-id") {
            id
            title
          }
        }`,
        variables: null,
      })
      .expect(200)

    console.log(response.body)
  })
  test.todo('it should get all incidents nearby to a given coordinate')
})
