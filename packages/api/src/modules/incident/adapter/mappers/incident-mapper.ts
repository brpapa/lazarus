import { Comment } from 'src/modules/incident/domain/models/comment'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { WatchedList } from 'src/modules/shared/domain/watched-list'
import { LocationMapper, LocationRedisModel } from '../../../shared/adapter/mappers/location-mapper'
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
      ownerUserId: domain.ownerUserId.toString(),
      title: domain.title,
      location: LocationMapper.fromDomainToDTO(domain.location),
      formattedAddress: domain.formattedAddress,
      medias: domain.medias.map(MediaMapper.fromDomainToDTO),
      usersNotifiedCount: domain.statistics.usersNotifiedCount,
      createdAt: domain.createdAt,
    }
  }

  static fromModelToDomain(
    incidentModel: IncidentPgModelPopulated,
    incidentLocationModel: LocationRedisModel,
  ): Incident {
    const incident = Incident.create(
      {
        ownerUserId: new UUID(incidentModel.creatorUserId),
        title: incidentModel.title,
        location: LocationMapper.fromModelToDomain(incidentLocationModel),
        formattedAddress: incidentModel.formattedAddress ?? undefined,
        createdAt: incidentModel.createdAt,
        comments: WatchedList.create<Comment>(
          incidentModel.comments.map(CommentMapper.fromModelToDomain),
        ),
      },
      new UUID(incidentModel.id),
    )

    const medias = incidentModel.medias.map((m) => MediaMapper.fromModelToDomain(m))
    incident.addMedias(medias)

    return incident
  }

  /** to pg model only */
  static fromDomainToModel(domain: Incident): IncidentPgModel {
    return {
      id: domain.id.toString(),
      title: domain.title,
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
