/* eslint-disable no-console */
// @ts-ignore
import { randomCirclePoint } from 'random-location'
import { UserPreferences } from 'src/modules/user/domain/models/user-preferences'
import { AWS_S3_BUCKET_NAME } from '../src/config'
import { Incident } from '../src/modules/incident/domain/models/incident'
import { Media } from '../src/modules/incident/domain/models/media'
import { MediaTypeEnum } from '../src/modules/incident/domain/models/media-type'
import { incidentRepo } from '../src/modules/incident/infra/db/repositories'
import { Device } from '../src/modules/notification/domain/models/device'
import {
  Notification,
  NotificationCodeEnum,
} from '../src/modules/notification/domain/models/notification'
import {
  LinkedEntityEnum,
  NotificationLink,
} from '../src/modules/notification/domain/models/notification-link'
import { deviceRepo, notificationRepo } from '../src/modules/notification/infra/db/repositories'
import { Location } from '../src/modules/shared/domain/models/location'
import { UUID } from '../src/modules/shared/domain/models/uuid'
import { User } from '../src/modules/user/domain/models/user'
import { UserEmail } from '../src/modules/user/domain/models/user-email'
import { UserPassword } from '../src/modules/user/domain/models/user-password'
import { userRepo } from '../src/modules/user/infra/db/repositories'
import {
  cleanUpDatasources as cleanUpDataSources,
  connectDataSources,
  disconnectDatasources,
} from '../tests/helpers'

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
          latitude: -22.87099719525191,
          longitude: -48.43652376998379,
        }),
        preferences: UserPreferences.create({ radiusDistanceMeters: 5000 }),
      },
      new UUID('user1-id'),
    ),
  )
  await deviceRepo.commit(
    Device.create({
      userId: user1.id.toString(),
      pushToken: 'ExponentPushToken[zySE7sNMPyqiK2n4KFYtBe]',
    }),
  )

  const user2 = await userRepo.commit(
    User.create(
      {
        username: 'reginasilva',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        email: UserEmail.create({ value: 'regina.silva@gmail.com' }).asOk(),
        name: 'Regina Silva',
        location: Location.create({
          latitude: -22.88091631588186,
          longitude: -48.446477625049754,
        }),
      },
      new UUID('reginasilva-id'),
    ),
  )
  // const user3 = await userRepo.commit(
  //   User.create(
  //     {
  //       username: 'User3',
  //       password: UserPassword.create({ value: '12345678' }).asOk(),
  //       email: UserEmail.create({ value: 'user3@gmail.com' }).asOk(),
  //       name: 'User 3',
  //       location: Location.create({
  //         latitude: -22.869999455074222,
  //         longitude: -48.430000841617584,
  //       }),
  //     },
  //     new UUID('user3-id'),
  //   ),
  // )

  const CENTER_POINT = { latitude: -22.877187463558492, longitude: -48.44966612756252 }
  const RADIUS_IN_METERS = 1e4

  const incidentsCreatedByUser2 = await Promise.all(
    new Array(0).fill(null).map(async (_, i) => {
      const randomPoint = randomCirclePoint(CENTER_POINT, RADIUS_IN_METERS)

      const incident = Incident.create({
        ownerUserId: user2.id,
        title: `Alerta ${i}`,
        location: Location.create(randomPoint),
      })

      incident.addMedias([
        Media.create({
          incidentId: incident.id,
          url: `https://s2.glbimg.com/6bPwIsd-7pKhBjeOmWxofRfJwhE=/0x0:1600x1200/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/f/h/EQhO4oSoaxjFk2ltAAwA/aeronave-queda.jpeg`,
          type: MediaTypeEnum.IMAGE,
          recordedAt: new Date(),
        }),
        Media.create({
          incidentId: incident.id,
          url: `https://www.jcnet.com.br/_midias/jpg/2020/01/23/whatsapp_image_2020_01_23_at_12_53_19-2207525.jpeg`,
          type: MediaTypeEnum.IMAGE,
          recordedAt: new Date(),
        }),
        Media.create({
          incidentId: incident.id,
          url: `https://www.jcnet.com.br/_midias/jpg/2020/01/23/whatsapp_image_2020_01_23_at_12_53_18-2207535.jpeg`,
          type: MediaTypeEnum.IMAGE,
          recordedAt: new Date(),
        }),
        // Media.create({
        //   incidentId: incident.id,
        //   url: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/2ffd2f91-71b1-4154-9510-4a4565dc52b6.mov`,
        //   type: MediaTypeEnum.VIDEO,
        //   recordedAt: new Date(),
        // }),
      ])

      return incidentRepo.commit(incident)
    }),
  )

  await notificationRepo.commitBatch(
    new Array(10).fill(null).map((_, i) =>
      Notification.create({
        targetUserId: user1.id.toString(),
        code: NotificationCodeEnum.NEARBY_INCIDENT_CREATED,
        title: 'Novo alerta',
        subtitle: `Alerta ${i}`,
        body: `Um usu??rio reportou um alerta h?? ${i % 5} km de voc??`,
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
