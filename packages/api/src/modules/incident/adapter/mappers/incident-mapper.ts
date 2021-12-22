import { CommentModel, IncidentModel, MediaModel } from '@prisma/client'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { WatchedList } from 'src/shared/domain/watched-list'
import { Location } from 'src/shared/domain/models/location'
import { UUID } from 'src/shared/domain/models/uuid'
import { IncidentDTO } from '../dtos/incident-dto'
import { LocationMapper } from '../../../../shared/adapter/mappers/location-mapper'
import { IncidentStatus } from '../../domain/models/incident-status'
import { MediaMapper } from './media-mapper'
import { CommentMapper } from './comment-mapper'

export class IncidentMapper {
  static fromPersistenceToDomain(
    incidentModel: IncidentModel & {
      medias: MediaModel[]
      comments: CommentModel[]
    },
    incidentLocationModel: { latitude: string; longitude: string },
  ): Incident {
    const incident = Incident.create(
      {
        ownerUserId: new UUID(incidentModel.creatorUserId),
        title: incidentModel.title,
        location: Location.create({
          latitude: Number(incidentLocationModel.latitude),
          longitude: Number(incidentLocationModel.longitude),
        }).asOk(),
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

  static fromDomainToDTO(domain: Incident): IncidentDTO {
    return {
      incidentId: domain.id.toString(),
      title: domain.title,
      location: LocationMapper.fromDomainToDTO(domain.location),
      medias: domain.medias.map(MediaMapper.fromDomainToDTO),
      createdAt: domain.createdAt,
    }
  }

  /** to postgress persistence model only */
  static fromDomainToPersistence(domain: Incident): IncidentModel {
    return {
      id: domain.id.toString(),
      title: domain.title,
      status: domain.status,
      statsCommentsCount: domain.statistics.commentsCount,
      statsReactionsCount: domain.statistics.reactionsCount,
      statsViewsCount: domain.statistics.viewsCount,
      statsUsersNotified: domain.statistics.usersNotified,
      creatorUserId: domain.ownerUserId.toString(),
      createdAt: domain.createdAt,
      updatedAt: domain.lastUpdateAt || null,
    }
  }
}
