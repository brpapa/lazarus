import { Comment } from '@incident/domain/models/comment'
import { Incident } from '@incident/domain/models/incident'
import { UUID } from '@shared/domain/models/uuid'
import { WatchedList } from '@shared/domain/watched-list'
import { LocationMapper, LocationRedisModel } from '../../../shared/adapter/mappers/location-mapper'
import { IncidentStatus } from '../../domain/models/incident-status'
import {
  IncidentPgModel,
  IncidentPgModelPopulated,
} from '../../infra/db/repositories/incident-repo'
import { IncidentDTO } from '../dtos/incident-dto'
import { CommentMapper } from './comment-mapper'
import { MediaMapper } from './media-mapper'

export class IncidentMapper {
  static fromDomainToDTO(domain: Incident): IncidentDTO {
    return {
      incidentId: domain.id.toString(),
      title: domain.title,
      location: LocationMapper.fromDomainToDTO(domain.location),
      formattedAddress: domain.formattedAddress,
      medias: domain.medias.map(MediaMapper.fromDomainToDTO),
      usersNotifiedCount: domain.statistics.usersNotifiedCount,
      createdAt: domain.createdAt,
    }
  }

  static fromPersistenceToDomain(
    incidentModel: IncidentPgModelPopulated,
    incidentLocationModel: LocationRedisModel,
  ): Incident {
    const incident = Incident.create(
      {
        ownerUserId: new UUID(incidentModel.creatorUserId),
        title: incidentModel.title,
        location: LocationMapper.fromPersistenceToDomain(incidentLocationModel),
        formattedAddress: incidentModel.formattedAddress ?? undefined,
        status: IncidentStatus[incidentModel.status],
        createdAt: incidentModel.createdAt,
        comments: WatchedList.create<Comment>(
          incidentModel.comments.map(CommentMapper.fromPersistenceToDomain),
        ),
      },
      new UUID(incidentModel.id),
    )

    const medias = incidentModel.medias.map((m) => MediaMapper.fromPersistenceToDomain(m))
    incident.addMedias(medias)

    return incident
  }

  /** to pg model only */
  static fromDomainToPersistence(domain: Incident): IncidentPgModel {
    return {
      id: domain.id.toString(),
      title: domain.title,
      status: domain.status,
      formattedAddress: domain.formattedAddress ?? null,
      statsCommentsCount: domain.statistics.commentsCount,
      statsReactionsCount: domain.statistics.reactionsCount,
      statsViewsCount: domain.statistics.viewsCount,
      statsUsersNotifiedCount: domain.statistics.usersNotifiedCount,
      creatorUserId: domain.ownerUserId.toString(),
      createdAt: domain.createdAt,
      updatedAt: domain.lastUpdateAt || null,
    }
  }
}
