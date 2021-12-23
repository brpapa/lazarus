import { CommentModel, IncidentModel, MediaModel } from '@prisma/client'
import assert from 'assert'
import debug from 'debug'
import {
  GeoReplyWith,
  GeoReplyWithMember,
  GeoSearchBy,
} from 'redis/dist/lib/commands/generic-transformers'
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

export type IncidentPgModel = IncidentModel
export type IncidentPgModelPopulated = IncidentPgModel & {
  medias: MediaModel[]
  comments: CommentModel[]
}

/**
 * each (incidentId, location) is persisted on Redis in a GeoSet data structure where:
 *  key: incidentLocations
 *  value: list of (member, location) pair, where member is the incidentId
 */
export class IncidentRepo extends PrismaRepo<Incident> implements IIncidentRepo {
  private baseInclude = { medias: true, comments: { take: 25 } }
  private REDIS_GEO_SET_KEY = 'incidentLocations'

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly redisClient: RedisClient,
    private readonly commentRepo: ICommentRepo,
  ) {
    super('incidentModel')
  }

  async findById(id: string): Promise<Incident | null> {
    const incident: IncidentPgModelPopulated | null =
      await this.prismaClient.incidentModel.findUnique({
        where: { id },
        include: { ...this.baseInclude },
      })
    return this.augmentedWithRedis(incident)
  }

  async findByIdBatch(ids: string[]): Promise<Incident[]> {
    const incidents: IncidentPgModelPopulated[] = await this.prismaClient.incidentModel.findMany({
      where: {
        id: { in: ids },
      },
      include: { ...this.baseInclude },
    })

    return this.augmentedWithRedisBatch(incidents)
  }

  async findAll(): Promise<Incident[]> {
    const incidents: IncidentPgModelPopulated[] = await this.prismaClient.incidentModel.findMany({
      include: { ...this.baseInclude },
    })

    return this.augmentedWithRedisBatch(incidents)
  }

  async findAllLocatedWithinBox(
    centerPoint: LocationProps,
    dimensionsInMeters: { width: number; height: number },
  ): Promise<Incident[]> {
    const byBox: GeoSearchBy = { ...dimensionsInMeters, unit: 'm' }
    const incidentsLocations = await this.redisClient.geoSearchWith(
      this.REDIS_GEO_SET_KEY,
      centerPoint,
      byBox,
      [GeoReplyWith.COORDINATES],
    )

    return this.augmentedWithPgBatch(incidentsLocations)
  }

  async commit(incident: Incident): Promise<Incident> {
    const incidentModel = IncidentMapper.fromDomainToPersistence(incident)
    const mediasModel = incident.medias.map((m) => MediaMapper.fromDomainToPersistence(m))

    // upsert (incidentId, location) pair (member is unique in a redis geo set)
    await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, {
      member: incident.id.toString(),
      latitude: incident.location.latitude,
      longitude: incident.location.longitude,
    })

    const isNew = !(await this.exists(incident))
    if (isNew) {
      log('Persisting a new incident: %o', incident.id.toString())
      await this.prismaClient.incidentModel.create({ data: incidentModel })
      await this.commentRepo.commitBatch(incident.comments)
      await this.prismaClient.mediaModel.createMany({ data: mediasModel })
    } else {
      log('Persisting an updated incident: %o', incident.id.toString())
      await this.prismaClient.mediaModel.createMany({ data: mediasModel })
      await this.commentRepo.commitBatch(incident.comments)
      await this.prismaClient.incidentModel.update({
        where: { id: incident.id.toString() },
        data: incidentModel,
      })
    }
    return incident
  }

  private async augmentedWithRedis(
    incident: IncidentPgModelPopulated | null,
  ): Promise<Incident | null> {
    if (incident === null) return null
    return this.augmentedWithRedisBatch([incident]).then(
      ([incidentWithLocation]) => incidentWithLocation,
    )
  }

  private async augmentedWithRedisBatch(
    incidents: IncidentPgModelPopulated[],
  ): Promise<Incident[]> {
    if (incidents.length === 0) return []

    const incidentsLocations = await this.redisClient.geoPos(
      this.REDIS_GEO_SET_KEY,
      incidents.map((incident) => incident.id),
    )

    return zip(incidents, incidentsLocations).map(([incident, incidentLocation]) => {
      assert(!!incident && !!incidentLocation)
      return IncidentMapper.fromPersistenceToDomain(incident, incidentLocation)
    })
  }

  private async augmentedWithPgBatch(locations: GeoReplyWithMember[]): Promise<Incident[]> {
    const incidentsId = locations.map((i) => i.member)

    const incidents = await this.prismaClient.incidentModel.findMany({
      where: { id: { in: incidentsId } },
      include: { ...this.baseInclude },
    })

    return zip(incidents, locations).map(([incident, location]) => {
      assert(!!incident && !!location)
      assert(incident.id.toString() === location.member)
      assert(location.coordinates !== undefined)
      return IncidentMapper.fromPersistenceToDomain(incident, location.coordinates)
    })
  }
}
