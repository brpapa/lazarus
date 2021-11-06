/* eslint-disable class-methods-use-this */
import { Incident } from 'src/modules/incident/domain/models/incident'
import { prisma } from 'src/infra/db/prisma/client'
import { IncidentMapper } from '../../adapter/mappers/incident'
import { MediaMapper } from '../../adapter/mappers/media'
import { IIncidentRepo } from '../../adapter/repositories/incident'
import { PrismaRepo } from '../../../../shared/infra/db/prisma-repo'
import { ICommentRepo } from '../../adapter/repositories/comment'
import { commentRepo } from './comment-repo'

class IncidentRepo extends PrismaRepo<Incident> implements IIncidentRepo {
  private baseInclude = { medias: true, comments: { take: 25 } }

  constructor(private readonly commentRepo: ICommentRepo) {
    super('incidentModel')
  }

  async findById(id: string): Promise<Incident | null> {
    const incidentModel = await prisma.incidentModel.findUnique({
      where: { id },
      include: this.baseInclude,
    })
    return incidentModel ? IncidentMapper.fromPersistenceToDomain(incidentModel) : null
  }

  async findManyByIds(ids: readonly string[]): Promise<Incident[]> {
    const incidentsModel = await prisma.incidentModel.findMany({
      where: {
        id: { in: ids.map((i) => i) },
      },
      include: this.baseInclude,
    })
    return incidentsModel.map((m) => IncidentMapper.fromPersistenceToDomain(m))
  }

  async commit(incident: Incident): Promise<void> {
    const incidentModel = IncidentMapper.fromDomainToPersistence(incident)
    const mediasModel = incident.medias.map((m) => MediaMapper.fromDomainToPersistence(m))

    const isNew = !(await this.exists(incident))
    if (isNew) {
      await prisma.incidentModel.create({ data: incidentModel })
      await this.commentRepo.commitMany(incident.comments)
      await prisma.mediaModel.createMany({ data: mediasModel })
    } else {
      await prisma.mediaModel.createMany({ data: mediasModel })
      await this.commentRepo.commitMany(incident.comments)
      await prisma.incidentModel.update({
        where: { id: incident.id.toString() },
        data: incidentModel,
      })
    }
  }
}

export const incidentRepo = new IncidentRepo(commentRepo)
