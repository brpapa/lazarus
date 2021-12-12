import { mockDeep } from 'jest-mock-extended'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { ReportIncidentCommand } from '../../src/modules/incident/application/commands/report-incident/command'

describe('command: create incident', () => {
  const mockedIncidentRepo = mockDeep<IIncidentRepo>()
  const createIncidentCommand = new ReportIncidentCommand(mockedIncidentRepo)

  test('it should create if a valid incident is given', async () => {
    const createdIncidentDTO = await createIncidentCommand.exec({
      userId: 'my-user-id',
      title: 'my title',
      coordinate: { latitude: 123, longitude: 456 },
      medias: [
        {
          url: 'https://s3.amazonaws.com',
          type: MediaType.IMAGE,
          recordedAt: new Date(),
        },
      ],
    })
    expect(createdIncidentDTO.isOk()).toBeTruthy()
    expect(mockedIncidentRepo.commit).toHaveBeenCalledTimes(1)
  })

  describe('it should return error if a invalid incident is given', () => {
    test("incident doesn't contain any medias", async () => {
      const createdIncidentDTO = await createIncidentCommand.exec({
        userId: 'my-user-id',
        title: 'my title',
        coordinate: { latitude: 123, longitude: 456 },
        medias: [],
      })
      expect(createdIncidentDTO.isErr()).toBeTruthy()
      expect(mockedIncidentRepo.commit).not.toHaveBeenCalledTimes(1)
    })
    test('incident contains many medias', async () => {
      const createdIncidentDTO = await createIncidentCommand.exec({
        userId: 'my-user-id',
        title: 'my title',
        coordinate: { latitude: 123, longitude: 456 },
        medias: Array(10)
          .fill(null)
          .map(() => ({
            url: 'https://s3.amazonaws.com',
            type: MediaType.IMAGE,
            recordedAt: new Date(),
          })),
      })
      expect(createdIncidentDTO.isErr()).toBeTruthy()
      expect(mockedIncidentRepo.commit).not.toHaveBeenCalledTimes(1)
    })
    test.todo('the current coordinate of creating user is not close to the incident coordinate')
  })
})
