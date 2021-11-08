import { Incident } from 'src/modules/incident/domain/models/incident'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { IncidentMapper } from '../../../adapter/mappers/incident'
import { MediaMapper } from '../../../adapter/mappers/media'
import { IIncidentRepo } from '../../../adapter/repositories/incident'
import { PrismaRepo } from '../../../../../shared/infra/db/prisma-repo'
import { ICommentRepo } from '../../../adapter/repositories/comment'
import { Coordinate } from '../../../../../shared/domain/models/coordinate'

export class IncidentRepo extends PrismaRepo<Incident> implements IIncidentRepo {
  private baseInclude = { medias: true, comments: { take: 25 } }

  constructor(private prismaClient: PrismaClient, private readonly commentRepo: ICommentRepo) {
    super('incidentModel')
  }

  async findById(id: string): Promise<Incident | null> {
    const incidentModel = await this.prismaClient.incidentModel.findUnique({
      where: { id },
      include: this.baseInclude,
    })
    return incidentModel ? IncidentMapper.fromPersistenceToDomain(incidentModel) : null
  }

  async findManyByIds(ids: readonly string[]): Promise<Incident[]> {
    const incidentsModel = await this.prismaClient.incidentModel.findMany({
      where: {
        id: { in: ids.map((i) => i) },
      },
      include: this.baseInclude,
    })
    return incidentsModel.map((m) => IncidentMapper.fromPersistenceToDomain(m))
  }

  findNearbyTo(coordinate: Coordinate, radius: number): Promise<Incident[]> {
    throw new Error('Method not implemented.')
    // await prisma.incidentModel.findMany({
    //   where: {
    //     coordinateLat: {
    //     },
    //   },
    // })
  }

  async commit(incident: Incident): Promise<void> {
    const incidentModel = IncidentMapper.fromDomainToPersistence(incident)
    const mediasModel = incident.medias.map((m) => MediaMapper.fromDomainToPersistence(m))

    const isNew = !(await this.exists(incident))
    if (isNew) {
      await this.prismaClient.incidentModel.create({ data: incidentModel })
      await this.commentRepo.commitMany(incident.comments)
      await this.prismaClient.mediaModel.createMany({ data: mediasModel })
    } else {
      await this.prismaClient.mediaModel.createMany({ data: mediasModel })
      await this.commentRepo.commitMany(incident.comments)
      await this.prismaClient.incidentModel.update({
        where: { id: incident.id.toString() },
        data: incidentModel,
      })
    }
  }
}
