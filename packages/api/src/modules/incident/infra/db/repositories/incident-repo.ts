import { CommentModel, IncidentModel, MediaModel } from '@prisma/client'
import assert from 'assert'
import { Debugger } from 'debug'
import {
  GeoReplyWith,
  GeoReplyWithMember,
  GeoSearchBy,
} from 'redis/dist/lib/commands/generic-transformers'
import { PrismaClient } from 'src/api/db/prisma/client'
import { RedisClient } from 'src/api/db/redis/client'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { zip } from 'src/modules/shared/logic/helpers/zip'
import { LocationProps } from '../../../../shared/domain/models/location'
import { PrismaRepo } from '../../../../shared/infra/db/prisma-repo'
import { IncidentMapper } from '../../../adapter/mappers/incident-mapper'
import { MediaMapper } from '../../../adapter/mappers/media-mapper'
import { ICommentRepo } from '../../../adapter/repositories/comment-repo'
import { IIncidentRepo } from '../../../adapter/repositories/incident-repo'

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
    private log: Debugger,
    private prismaClient: PrismaClient,
    private redisClient: RedisClient,
    private commentRepo: ICommentRepo,
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
      where: { id: { in: ids } },
      include: { ...this.baseInclude },
    })
    const orderedIncidents = ids.map((id) => incidents.find((v) => v.id === id) ?? null)
    return this.augmentedWithRedisBatch(orderedIncidents)
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

    const toAdd = {
      member: incident.id.toString(), // member is unique in a redis geo set
      latitude: incident.location.latitude,
      longitude: incident.location.longitude,
    }
    this.log('Persisting a new or updated (member, location) on Redis: %o', toAdd)
    await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, toAdd)

    const isNew = !(await this.exists(incident))
    if (isNew) {
      this.log('Persisting a new incident on Pg: %o', incident.id.toString())
      await this.prismaClient.incidentModel.create({ data: incidentModel })
      await this.commentRepo.commitBatch(incident.comments)
      await this.prismaClient.mediaModel.createMany({ data: mediasModel })
    } else {
      this.log('Persisting an updated incident on Pg: %o', incident.id.toString())
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
    incidents: (IncidentPgModelPopulated | null)[],
  ): Promise<Incident[]> {
    if (incidents.length === 0) return []

    // returns in the same order
    const incidentsLocations = await this.redisClient.geoPos(
      this.REDIS_GEO_SET_KEY,
      incidents.map((incident) => incident?.id || ''),
    )

    return zip(incidents, incidentsLocations).map(([incident, incidentLocation]) => {
      assert(!!incident && !!incidentLocation)
      return IncidentMapper.fromPersistenceToDomain(incident, incidentLocation)
    })
  }

  private async augmentedWithPgBatch(locations: GeoReplyWithMember[]): Promise<Incident[]> {
    const incidentsId = locations.map((v) => v.member)

    const incidents = await this.prismaClient.incidentModel.findMany({
      where: { id: { in: incidentsId } },
      include: { ...this.baseInclude },
    })
    const orderedIncidents = incidentsId.map(
      (incidentId) => incidents.find((v) => v.id === incidentId) ?? null,
    )

    return zip(orderedIncidents, locations).map(([incident, location]) => {
      assert(!!incident && !!location)
      assert(incident.id.toString() === location.member)
      assert(location.coordinates !== undefined)
      return IncidentMapper.fromPersistenceToDomain(incident, location.coordinates)
    })
  }
}
