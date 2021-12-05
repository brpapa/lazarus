import request from 'supertest'
import { app } from 'src/infra/http/app'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { User } from 'src/modules/user/domain/models/user'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Coordinate } from 'src/shared/domain/models/coordinate'

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
        phoneNumber: UserPhoneNumber.create({ value: '14 999999999' }).asOk(),
      }).asOk(),
    )
    const incident = await incidentRepo.commit(
      Incident.create({
        ownerUserId: user.id,
        title: 'incident 1',
        coordinate: Coordinate.create({ latitude: 2, longitude: 2 }).asOk(),
      }).asOk(),
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
