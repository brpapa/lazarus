import { Incident } from 'src/modules/incident/domain/models/incident'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { RedisClient } from 'src/infra/db/redis/client'
import assert from 'assert'
import { zip } from 'src/shared/logic/helpers/zip'
import { GeoReplyWith } from 'redis/dist/lib/commands/generic-transformers'
import { IncidentMapper } from '../../../adapter/mappers/incident'
import { MediaMapper } from '../../../adapter/mappers/media'
import { IIncidentRepo } from '../../../adapter/repositories/incident'
import { PrismaRepo } from '../../../../../shared/infra/db/prisma-repo'
import { ICommentRepo } from '../../../adapter/repositories/comment'
import { CoordinateProps } from '../../../../../shared/domain/models/coordinate'

export class IncidentRepo extends PrismaRepo<Incident> implements IIncidentRepo {
  private baseInclude = { medias: true, comments: { take: 25 } }

  // redis geo set: maps each key to a list of pairs of member and location
  // member: <INCIDENT_ID>
  private REDIS_GEO_SET_KEY = 'incidentLocations'

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly redisClient: RedisClient,
    private readonly commentRepo: ICommentRepo,
  ) {
    super('incidentModel')
  }

  async findById(id: string): Promise<Incident | null> {
    const incidentModel = await this.prismaClient.incidentModel.findUnique({
      where: { id },
      include: { ...this.baseInclude },
    })

    if (incidentModel) {
      const [incidentCoordModel] = await this.redisClient.geoPos(this.REDIS_GEO_SET_KEY, id)
      assert(!!incidentCoordModel)
      return IncidentMapper.fromPersistenceToDomain(incidentModel, incidentCoordModel)
    }

    return null
  }

  async findManyByIds(ids: string[]): Promise<Incident[]> {
    const incidentsModels = await this.prismaClient.incidentModel.findMany({
      where: {
        id: { in: ids },
      },
      include: { ...this.baseInclude },
    })

    if (incidentsModels.length > 0) {
      const incidentsCoordsModels = await this.redisClient.geoPos(this.REDIS_GEO_SET_KEY, ids)

      return zip(incidentsModels, incidentsCoordsModels).map(
        ([incidentModel, incidentCoordModel]) => {
          assert(!!incidentModel && !!incidentCoordModel)
          return IncidentMapper.fromPersistenceToDomain(incidentModel, incidentCoordModel)
        },
      )
    }

    return []
  }

  async findManyWithinBox(
    centerPoint: CoordinateProps,
    dimensionsInMeters: { width: number; height: number },
  ): Promise<Incident[]> {
    const incidentsCoordsModels = await this.redisClient.geoSearchWith(
      this.REDIS_GEO_SET_KEY,
      centerPoint,
      { ...dimensionsInMeters, unit: 'm' },
      [GeoReplyWith.COORDINATES],
    )
    const incidentsIds = incidentsCoordsModels.map((i) => i.member)

    const incidentsModel = await this.prismaClient.incidentModel.findMany({
      where: { id: { in: incidentsIds } },
      include: { ...this.baseInclude },
    })

    return zip(incidentsModel, incidentsCoordsModels).map(([incidentModel, incidentCoordModel]) => {
      assert(!!incidentModel && !!incidentCoordModel)
      assert(incidentCoordModel.coordinates !== undefined)
      return IncidentMapper.fromPersistenceToDomain(incidentModel, incidentCoordModel.coordinates)
    })
  }

  async commit(incident: Incident): Promise<Incident> {
    const incidentModel = IncidentMapper.fromDomainToPersistence(incident)
    const mediasModel = incident.medias.map((m) => MediaMapper.fromDomainToPersistence(m))

    // upsert, because member is unique between a redis geo set
    await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, {
      member: incident.id.toString(),
      latitude: incident.coordinate.latitude,
      longitude: incident.coordinate.longitude,
    })

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

    return incident
  }
}
