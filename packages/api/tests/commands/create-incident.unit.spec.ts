import { AppContext } from './../../src/modules/shared/logic/app-context'
import { Debugger } from 'debug'
import { mockDeep } from 'jest-mock-extended'
import { IGeocodingService } from 'src/modules/incident/adapter/geocoding-service'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { ReportIncidentCommand } from '../../src/modules/incident/application/commands/report-incident-command'

describe('command: create incident', () => {
  const mockedIncidentRepo = mockDeep<IIncidentRepo>()
  const mockedUserRepo = mockDeep<IUserRepo>()
  const mockedGeocodingService = mockDeep<IGeocodingService>()
  const log = mockDeep<Debugger>()
  const ctx: AppContext = { userId: 'my-user-id' }
  const createIncidentCommand = new ReportIncidentCommand(
    log,
    mockedIncidentRepo,
    mockedUserRepo,
    mockedGeocodingService,
  )

  test('it should create if a valid incident is given', async () => {
    const createdIncidentDTO = await createIncidentCommand.exec(
      {
        title: 'my title',
        medias: [
          {
            url: 'https://s3.amazonaws.com',
          },
        ],
      },
      ctx,
    )
    expect(createdIncidentDTO.isOk()).toBeTruthy()
    expect(mockedIncidentRepo.commit).toHaveBeenCalledTimes(1)
  })

  describe('it should return error if a invalid incident is given', () => {
    test("incident doesn't contain any medias", async () => {
      const createdIncidentDTO = await createIncidentCommand.exec(
        {
          title: 'my title',
          medias: [],
        },
        ctx,
      )
      expect(createdIncidentDTO.isErr()).toBeTruthy()
      expect(mockedIncidentRepo.commit).not.toHaveBeenCalledTimes(1)
    })
    test('incident contains many medias', async () => {
      const createdIncidentDTO = await createIncidentCommand.exec(
        {
          title: 'my title',
          medias: Array(10)
            .fill(null)
            .map(() => ({
              url: 'https://s3.amazonaws.com',
              type: MediaType.IMAGE,
              recordedAt: new Date(),
            })),
        },
        ctx,
      )
      expect(createdIncidentDTO.isErr()).toBeTruthy()
      expect(mockedIncidentRepo.commit).not.toHaveBeenCalledTimes(1)
    })
    test.todo('the current coordinate of creating user is not close to the incident coordinate')
  })
})
