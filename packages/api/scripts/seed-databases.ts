// @ts-ignore
import { randomCirclePoint } from 'random-location'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Coordinate } from 'src/shared/domain/models/coordinate'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { User } from 'src/modules/user/domain/models/user'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'

async function main() {
  await connectDataSources()
  await cleanUpDatasources()
  await populate()
}

const populate = async () => {
  const USER_COORDINATE = {
    latitude: -22.8886,
    longitude: -48.4406,
  }

  const user = await userRepo.commit(
    User.create({
      username: 'my-username',
      password: UserPassword.create({ value: '1234567890' }).asOk(),
      phoneNumber: UserPhoneNumber.create({ value: '14 999999999' }).asOk(),
    }).asOk(),
  )

  const CENTER_POINT = { latitude: -22.877187463558492, longitude: -48.44966612756252 }
  const RADIUS_IN_METERS = 1e5

  await Promise.all(
    new Array(100).fill(null).map(async (_, i) => {
      const randomPoint = randomCirclePoint(CENTER_POINT, RADIUS_IN_METERS)

      await incidentRepo.commit(
        Incident.create({
          ownerUserId: user.id,
          title: `incident ${i}`,
          coordinate: Coordinate.create(randomPoint).asOk(),
        }).asOk(),
      )
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
