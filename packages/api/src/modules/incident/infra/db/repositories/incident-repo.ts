import assert from 'assert'
import debug from 'debug'
import { GeoReplyWith } from 'redis/dist/lib/commands/generic-transformers'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { RedisClient } from 'src/infra/db/redis/client'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { zip } from 'src/shared/logic/helpers/zip'
import { LocationProps } from '../../../../../shared/domain/models/location'
import { PrismaRepo } from '../../../../../shared/infra/db/prisma-repo'
import { IncidentMapper } from '../../../adapter/mappers/incident-mapper'
import { MediaMapper } from '../../../adapter/mappers/media-mapper'
import { ICommentRepo } from '../../../adapter/repositories/comment-repo'
import { IIncidentRepo } from '../../../adapter/repositories/incident-repo'

const log = debug('app:incident:infra')

/**
 * each pair (incidentId, location) is persisted on Redis in a GeoSet data structure
 */
export class IncidentRepo extends PrismaRepo<Incident> implements IIncidentRepo {
  private baseInclude = { medias: true, comments: { take: 25 } }

  // redis geo set: maps each key to a list of pairs of member and location
  // here member is incidentId
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
      const [incidentCoordModel] = await this.redisClient.geoPos(
        this.REDIS_GEO_SET_KEY,
        incidentModel.id,
      )
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
      const incidentsCoordsModels = await this.redisClient.geoPos(
        this.REDIS_GEO_SET_KEY,
        incidentsModels.map((i) => i.id),
      )

      return zip(incidentsModels, incidentsCoordsModels).map(
        ([incidentModel, incidentCoordModel]) => {
          assert(!!incidentModel && !!incidentCoordModel)
          return IncidentMapper.fromPersistenceToDomain(incidentModel, incidentCoordModel)
        },
      )
    }

    return []
  }

  async findMany(): Promise<Incident[]> {
    const incidentsModels = await this.prismaClient.incidentModel.findMany({
      include: { ...this.baseInclude },
    })

    if (incidentsModels.length > 0) {
      const incidentsCoordsModels = await this.redisClient.geoPos(
        this.REDIS_GEO_SET_KEY,
        incidentsModels.map((i) => i.id),
      )

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
    centerPoint: LocationProps,
    dimensionsInMeters: { width: number; height: number },
  ): Promise<Incident[]> {
    const incidentLocationsModels = await this.redisClient.geoSearchWith(
      this.REDIS_GEO_SET_KEY,
      centerPoint,
      { ...dimensionsInMeters, unit: 'm' },
      [GeoReplyWith.COORDINATES],
    )
    const incidentsIds = incidentLocationsModels.map((i) => i.member)

    const incidentsModel = await this.prismaClient.incidentModel.findMany({
      where: { id: { in: incidentsIds } },
      include: { ...this.baseInclude },
    })

    return zip(incidentsModel, incidentLocationsModels).map(
      ([incidentModel, incidentLocationModel]) => {
        assert(!!incidentModel && !!incidentLocationModel)
        assert(incidentLocationModel.coordinates !== undefined)
        return IncidentMapper.fromPersistenceToDomain(
          incidentModel,
          incidentLocationModel.coordinates,
        )
      },
    )
  }

  async commit(incident: Incident): Promise<Incident> {
    try {
      const incidentModel = IncidentMapper.fromDomainToPersistence(incident)
      const mediasModel = incident.medias.map((m) => MediaMapper.fromDomainToPersistence(m))

      // upsert, because member is unique between a redis geo set
      await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, {
        member: incident.id.toString(),
        latitude: incident.location.latitude,
        longitude: incident.location.longitude,
      })

      const isNew = !(await this.exists(incident))
      if (isNew) {
        log('Persisting a new incident: %o', incident.id.toString())
        await this.prismaClient.incidentModel.create({ data: incidentModel })
        await this.commentRepo.commitMany(incident.comments)
        await this.prismaClient.mediaModel.createMany({ data: mediasModel })
      } else {
        log('Persisting an updated incident: %o', incident.id.toString())
        await this.prismaClient.mediaModel.createMany({ data: mediasModel })
        await this.commentRepo.commitMany(incident.comments)
        await this.prismaClient.incidentModel.update({
          where: { id: incident.id.toString() },
          data: incidentModel,
        })
      }
      return incident
    } catch (e) {
      log('Unexpected error: %O', e)
      throw e
    }
  }
}
