/* eslint-disable no-console */
import { Incident } from '@incident/domain/models/incident'
import { Media } from '@incident/domain/models/media'
import { MediaType } from '@incident/domain/models/media-type'
import { incidentRepo } from '@incident/infra/db/repositories'
import { Device } from '@notification/domain/models/device'
import { Notification } from '@notification/domain/models/notification'
import { deviceRepo, notificationRepo } from '@notification/infra/db/repositories'
import { LinkedEntityEnum, NotificationCodeEnum } from '@prisma/client'
import { Location } from '@shared/domain/models/location'
import { UUID } from '@shared/domain/models/uuid'
import { User } from '@user/domain/models/user'
import { UserPassword } from '@user/domain/models/user-password'
import { userRepo } from '@user/infra/db/repositories'
// @ts-ignore
import { randomCirclePoint } from 'random-location'
import { AWS_S3_BUCKET_NAME } from 'src/config'
import { NotificationLink } from '@notification/domain/models/notification-link'
import { UserEmail } from '@user/domain/models/user-email'
import {
  cleanUpDatasources as cleanUpDataSources,
  connectDataSources,
  disconnectDatasources,
} from 'tests/helpers'

async function main() {
  await connectDataSources()
  await cleanUpDataSources()
  await seed()
}

const seed = async () => {
  const user1 = await userRepo.commit(
    User.create(
      {
        username: 'User1',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        email: UserEmail.create({ value: 'user1@gmail.com' }).asOk(),
        name: 'User 1',
        location: Location.create({
          latitude: -22.89,
          longitude: -48.45,
        }),
      },
      new UUID('user1-id'),
    ),
  )
  await deviceRepo.commit(
    Device.create({
      userId: user1.id.toString(),
      pushToken: 'ExponentPushToken[DF6cYjJOtKDh12NixCSznh]',
    }),
  )

  const user2 = await userRepo.commit(
    User.create(
      {
        username: 'User2',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        email: UserEmail.create({ value: 'user2@gmail.com' }).asOk(),
        name: 'User 2',
        location: Location.create({
          latitude: -22.87,
          longitude: -48.43,
        }),
      },
      new UUID('user2-id'),
    ),
  )
  const user3 = await userRepo.commit(
    User.create(
      {
        username: 'User3',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        email: UserEmail.create({ value: 'user3@gmail.com' }).asOk(),
        name: 'User 3',
        location: Location.create({
          latitude: -22.27,
          longitude: -47.93,
        }),
      },
      new UUID('user3-id'),
    ),
  )

  const CENTER_POINT = { latitude: -22.877187463558492, longitude: -48.44966612756252 }
  const RADIUS_IN_METERS = 1e4

  const incidentsCreatedByUser2 = await Promise.all(
    new Array(30).fill(null).map(async (_, i) => {
      const randomPoint = randomCirclePoint(CENTER_POINT, RADIUS_IN_METERS)

      const incident = Incident.create({
        ownerUserId: user2.id,
        title: `incident ${i}`,
        location: Location.create(randomPoint),
      })

      incident.addMedias([
        Media.create({
          incidentId: incident.id,
          url: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/91cacff3-c5f3-4b7e-93c7-37098dee928e.jpg`,
          type: MediaType.IMAGE,
          recordedAt: new Date(),
        }),
        Media.create({
          incidentId: incident.id,
          url: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/2ffd2f91-71b1-4154-9510-4a4565dc52b6.mov`,
          type: MediaType.VIDEO,
          recordedAt: new Date(),
        }),
      ])

      return incidentRepo.commit(incident)
    }),
  )

  await notificationRepo.commitBatch(
    new Array(30).fill(null).map((_, i) =>
      Notification.create({
        targetUserId: user1.id.toString(),
        code: NotificationCodeEnum.NEARBY_INCIDENT_CREATED,
        title: 'Novo alerta',
        subtitle: `Alerta ${i}`,
        body: `Um usuário reportou um alerta há ${i % 5} km de você`,
        link: NotificationLink.create({
          entity: LinkedEntityEnum.INCIDENT,
          entityId: incidentsCreatedByUser2[i].id.toString(),
        }),
        createdAt: (() => {
          const date = new Date()
          date.setMinutes(i)
          return date
        })(),
      }),
    ),
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await disconnectDatasources()
  })
