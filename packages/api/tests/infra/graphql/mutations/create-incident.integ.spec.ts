import request from 'supertest'
import { app } from 'src/infra/http/app'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { prismaClient } from 'src/infra/db/prisma/client'

describe('graphql mutations: create incident', () => {
  beforeAll(connectDataSources)
  beforeEach(cleanUpDatasources)
  beforeEach(cleanUpDatasources)
  afterAll(disconnectDatasources)

  test('it should create a incident', async () => {
    await createUser('user-id')

    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation ($input: CreateIncidentInput!) {
            createIncident(input: $input) {
              clientMutationId
              incident {
                incidentId
                title
              }
            }
          }
        `,
        variables: {
          input: {
            userId: 'user-id',
            title: 'my-incident',
            coordinate: {
              latitude: 23,
              longitude: 23,
            },
            medias: [
              {
                url: 'http://s3.com',
              },
            ],
          },
        },
      })
      .expect(200)

    expect(response.body?.data?.createIncident?.clientMutationId).not.toBeTruthy()
    expect(response.body?.data?.createIncident?.incident).toBeTruthy()
  })
})

const createUser = async (userId: string) => {
  await prismaClient.userModel.create({
    data: {
      id: userId,
      username: 'my awesome name',
      password: 'my awesome password',
      phoneNumber: '14 9999999',
      phoneNumberVerified: true,
    },
  })
}
