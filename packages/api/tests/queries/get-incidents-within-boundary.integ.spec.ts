import { incidentsQuery } from 'src/modules/incident/application/queries'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { Location } from 'src/modules/shared/domain/models/location'
import { User } from 'src/modules/user/domain/models/user'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { UserEmail } from 'src/modules/user/domain/models/user-email'

describe('queries: get incidents inside boundary', () => {
  beforeAll(async () => {
    await connectDataSources()

    const user = await userRepo.commit(
      User.create({
        username: 'my-username',
        password: UserPassword.create({ value: '1234567890' }).asOk(),
        email: UserEmail.create({ value: 'user@gmail.com' }).asOk(),
        name: 'User full name',
      }),
    )

    const LAT = -22.877187463558492
    const LAT_DELTA = 0.05350546334131323 / 2
    const LNG = -48.44966612756252
    const LNG_DELTA = 0.03523886203765869 / 2

    const coords = [
      [-22.878094923939546, -48.44975475794923],
      [LAT + 2 * LAT_DELTA * 0.1 - LAT_DELTA, LNG + 2 * LNG_DELTA * 0.9 - LNG_DELTA],
      [LAT + 2 * LAT_DELTA * 0.3 - LAT_DELTA, LNG + 2 * LNG_DELTA * 0.7 - LNG_DELTA],
      [LAT + 2 * LAT_DELTA * 0.5 - LAT_DELTA, LNG + 2 * LNG_DELTA * 0.5 - LNG_DELTA],
      [LAT + 2 * LAT_DELTA * 0.7 - LAT_DELTA, LNG + 2 * LNG_DELTA * 0.3 - LNG_DELTA],
      [LAT + 2 * LAT_DELTA * 0.9 - LAT_DELTA, LNG + 2 * LNG_DELTA * 0.1 - LNG_DELTA],
    ]

    await Promise.all(
      coords.map(async ([lat, lng], i) => {
        await incidentRepo.commit(
          Incident.create({
            ownerUserId: user.id,
            title: `incident ${i}`,
            location: Location.create({
              latitude: lat,
              longitude: lng,
            }),
          }),
        )
      }),
    )
  })
  afterAll(async () => {
    await cleanUpDatasources()
    await disconnectDatasources()
  })

  test.todo('it should return only the incidents inside the boundaries', async () => {
    const incidents = await incidentsQuery.exec(
      {
        filter: {
          withinBox: {
            northEast: {
              latitude: -22.871394175410675,
              longitude: -48.44534173607826,
            },
            southWest: {
              latitude: -22.884795550708546,
              longitude: -48.45416821539402,
            },
          },
        },
      },
      { userId: null },
    )
    expect(incidents.incidents.length).toBe(1)
  })
})
