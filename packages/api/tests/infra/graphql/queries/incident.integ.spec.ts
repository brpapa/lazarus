import { Incident } from '@incident/domain/models/incident'
import { incidentRepo } from '@incident/infra/db/repositories'
import { Location } from '@shared/domain/models/location'
import { User } from '@user/domain/models/user'
import { UserPassword } from '@user/domain/models/user-password'
import { userRepo } from '@user/infra/db/repositories'
import { app } from 'src/api/http/app'
import { UserEmail } from 'src/modules/user/domain/models/user-email'
import request from 'supertest'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'

describe('graphql queries: incident', () => {
  beforeAll(async () => {
    await connectDataSources()
    await cleanUpDatasources()
  })
  afterAll(async () => {
    await cleanUpDatasources()
    await disconnectDatasources()
  })

  test('it should get a incident', async () => {
    const user = await userRepo.commit(
      User.create({
        username: 'my-username',
        password: UserPassword.create({ value: '1234567890' }).asOk(),
        email: UserEmail.create({ value: 'user@gmail.com' }).asOk(),
        name: 'User full name',
      }),
    )
    const incident = await incidentRepo.commit(
      Incident.create({
        ownerUserId: user.id,
        title: 'incident 1',
        location: Location.create({ latitude: 2, longitude: 2 }),
      }),
    )

    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query: `
          query Q($id: String!) {
            incident(id: $id) {
              incidentId
              title
            }
          }
        `,
        variables: {
          id: incident.id,
        },
      })
      .expect(200)

    console.log(response.body)
  })
  test.todo('it should get all incidents nearby to a given coordinate')
})
