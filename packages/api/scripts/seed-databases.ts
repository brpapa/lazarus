// @ts-ignore
import { randomCirclePoint } from 'random-location'
import { AWS_S3_BUCKET_NAME } from 'src/config'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Media } from 'src/modules/incident/domain/models/media'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { Device } from 'src/modules/notifications/domain/Device'
import { deviceRepo } from 'src/modules/notifications/infra/db/repositories'
import { Location } from 'src/modules/shared/domain/models/location'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import {
  cleanUpDatasources as cleanUpDataSources,
  connectDataSources,
  disconnectDatasources,
} from 'tests/helpers'

async function main() {
  await connectDataSources()
  await cleanUpDataSources()
  await populate()
}

const populate = async () => {
  const user1 = await userRepo.commit(
    User.create(
      {
        username: 'User1',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        phoneNumber: UserPhoneNumber.create({ value: '14 999999999' }).asOk(),
        location: Location.create({
          latitude: -22.89,
          longitude: -48.45,
        }),
      },
      new UUID('User1'),
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
        phoneNumber: UserPhoneNumber.create({ value: '14 999999999' }).asOk(),
        location: Location.create({
          latitude: -22.87,
          longitude: -48.43,
        }),
      },
      new UUID('User2'),
    ),
  )
  const user3 = await userRepo.commit(
    User.create(
      {
        username: 'User3',
        password: UserPassword.create({ value: '12345678' }).asOk(),
        phoneNumber: UserPhoneNumber.create({ value: '14 999999999' }).asOk(),
        location: Location.create({
          latitude: -22.27,
          longitude: -47.93,
        }),
      },
      new UUID('User3'),
    ),
  )

  const CENTER_POINT = { latitude: -22.877187463558492, longitude: -48.44966612756252 }
  const RADIUS_IN_METERS = 1e3

  await Promise.all(
    new Array(10).fill(null).map(async (_, i) => {
      const randomPoint = randomCirclePoint(CENTER_POINT, RADIUS_IN_METERS)

      const incident = Incident.create({
        ownerUserId: user1.id,
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
      ])

      await incidentRepo.commit(incident)
    }),
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
