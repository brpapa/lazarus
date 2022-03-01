import assert from 'assert'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { prismaClient } from 'src/api/db/prisma/client'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { MediaTypeEnum } from 'src/modules/incident/domain/models/media-type'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { Location } from 'src/modules/shared/domain/models/location'
import { IncidentStatusEnum } from 'src/modules/incident/domain/models/incident-status'
import { Media } from 'src/modules/incident/domain/models/media'
import { Comment } from 'src/modules/incident/domain/models/comment'

describe('repository: incident', () => {
  beforeAll(connectDataSources)
  beforeEach(cleanUpDatasources)
  afterAll(disconnectDatasources)

  describe('it should commit a new incident', () => {
    test('it should create a new incident', async () => {
      await createUser('my-user-id')

      const incident = Incident.create({
        ownerUserId: new UUID('my-user-id'),
        title: 'title',
        location: Location.create({ latitude: -20, longitude: 40 }),
      })

      incident.addMedias([
        Media.create({
          incidentId: incident.id,
          url: 'url',
          type: MediaTypeEnum.IMAGE,
          recordedAt: new Date(),
        }),
      ])

      // also dispath the domain event from instance
      await incidentRepo.commit(incident)

      const retriviedIncident = await incidentRepo.findById(incident.id.toString())
      assert(retriviedIncident !== null)
      expect(incident).toEqual(retriviedIncident)
    })
  })

  describe('is should commit an updated incident', () => {
    test('it should update the title of an existing incident', async () => {
      await createUser('my-user-id')
      await createIncident('my-existing-incident-id', 'my-user-id')

      const incident = await incidentRepo.findById('my-existing-incident-id')
      assert(incident)
      incident.props.title = 'new title'

      await incidentRepo.commit(incident)

      const retriviedIncident = await incidentRepo.findById(incident.id.toString())
      assert(retriviedIncident !== null)
      expect(retriviedIncident.title).toEqual('new title')
    })
    test('it should add comments to an existing incident without comments', async () => {
      await createUser('my-user-id')
      await createIncident('my-existing-incident-id', 'my-user-id')

      const incident = await incidentRepo.findById('my-existing-incident-id')
      assert(incident)

      incident.addComments([
        Comment.create({
          ownerUserId: new UUID('my-user-id'),
          incidentId: new UUID('my-existing-incident-id'),
          content: 'my comment here',
        }).asOk(),
      ])

      await incidentRepo.commit(incident)

      const retriviedIncident = await incidentRepo.findById('my-existing-incident-id')
      assert(retriviedIncident)

      expect(retriviedIncident.comments.currentItems.length).toBe(
        incident.comments.currentItems.length,
      )
      expect(retriviedIncident.comments.currentItems).toEqual(incident.comments.currentItems)
    })
    test('it should add comments to an existing incident that constains many comments without load from database all comments', async () => {
      await createUser('my-user-id')
      await createIncident('my-existing-incident-id', 'my-user-id')

      await prismaClient.incidentModel.update({
        where: { id: 'my-existing-incient-id' },
        data: {
          comments: {
            create: Array(1)
              .fill(null)
              .map((_, i) => ({
                userId: 'my-user-id',
                content: `my comment ${i}`,
              })),
          },
        },
      })

      const incident = await incidentRepo.findById('my-existing-incident-id')
      assert(incident)
      expect(incident.comments.currentItems.length).toBeLessThanOrEqual(100)

      const newComments = Array(2)
        .fill(null)
        .map(() =>
          Comment.create({
            ownerUserId: new UUID('my-user-id'),
            incidentId: new UUID('my-existing-incident-id'),
            content: 'my comment here',
          }).asOk(),
        )
      incident.addComments(newComments)
      await incidentRepo.commit(incident)

      const persistedCount = await prismaClient.commentModel.count({
        where: { incidentId: 'my-existing-incident-id' },
      })
      expect(persistedCount).toBe(100 + 2)
    })
    test.todo('it should remove comment of an existing incident')
  })
})

const createUser = async (userId: string) => {
  await prismaClient.userModel.create({
    data: {
      id: userId,
      username: 'my awesome name',
      password: 'my awesome password',
      email: 'bas@gmail.com',
      name: 'user',
      preferencesLanguage: 'pt_BR',
      preferencesRadiusDistance: 40,
    },
  })
}

const createIncident = async (incidentId: string, userId: string) => {
  await prismaClient.incidentModel.create({
    data: {
      id: incidentId,
      title: 'my title',
      status: IncidentStatusEnum.ACTIVE,
      statsCommentsCount: 0,
      statsReactionsCount: 0,
      statsViewsCount: 0,
      statsUsersNotifiedCount: 0,
      creatorUserId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
}
