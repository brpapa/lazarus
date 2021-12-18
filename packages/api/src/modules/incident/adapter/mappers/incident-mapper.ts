import { CommentModel, IncidentModel, MediaModel } from '@prisma/client'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { WatchedList } from 'src/shared/domain/watched-list'
import { Coordinate } from 'src/shared/domain/models/coordinate'
import { UUID } from 'src/shared/domain/models/uuid'
import { IncidentDTO } from '../dtos/incident-dto'
import { CoordinateMapper } from './coordinate-mapper'
import { IncidentStatus } from '../../domain/models/incident-status'
import { MediaMapper } from './media-mapper'
import { CommentMapper } from './comment-mapper'

export class IncidentMapper {
  static fromPersistenceToDomain(
    incidentModel: IncidentModel & {
      medias: MediaModel[]
      comments: CommentModel[]
    },
    incidentCoordModel: { latitude: string; longitude: string },
  ): Incident {
    const incident = Incident.create(
      {
        ownerUserId: new UUID(incidentModel.creatorUserId),
        title: incidentModel.title,
        coordinate: Coordinate.create({
          latitude: Number(incidentCoordModel.latitude),
          longitude: Number(incidentCoordModel.longitude),
        }).asOk(),
        status: IncidentStatus[incidentModel.status],
        createdAt: incidentModel.createdAt,
        comments: WatchedList.create<Comment>(
          incidentModel.comments.map(CommentMapper.fromPersistenceToDomain),
        ),
      },
      new UUID(incidentModel.id),
    ).asOk()

    const medias = incidentModel.medias.map((m) => MediaMapper.fromPersistenceToDomain(m))
    incident.addMedias(medias)

    return incident
  }

  static fromDomainToDTO(domain: Incident): IncidentDTO {
    return {
      incidentId: domain.id.toString(),
      title: domain.title,
      coordinate: CoordinateMapper.fromDomainToDTO(domain.coordinate),
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
