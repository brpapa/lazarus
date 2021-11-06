import { CommentModel, IncidentModel, MediaModel, Prisma } from '@prisma/client'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { WatchedList } from 'src/shared/domain/watched-list'
import { Coordinate } from 'src/modules/incident/domain/models/coordinate'
import { UUID } from 'src/shared/domain/id'
import { IncidentDTO } from '../dtos/incident'
import { LocationMapper } from './coordinate'
import { IncidentStatus } from '../../domain/models/incident-status'
import { MediaMapper } from './media'
import { CommentMapper } from './comment'

export class IncidentMapper {
  static fromPersistenceToDomain(
    model: IncidentModel & {
      medias: MediaModel[]
      comments: CommentModel[]
    },
  ): Incident {
    const incident = Incident.create(
      {
        ownerUserId: new UUID(model.creatorUserId),
        title: model.title,
        coordinate: Coordinate.create({
          latitude: model.coordinateLat.toNumber(),
          longitude: model.coordinateLng.toNumber(),
        }).asOk(),
        status: IncidentStatus[model.status],
        createdAt: model.createdAt,
        comments: WatchedList.create<Comment>(
          model.comments.map(CommentMapper.fromPersistenceToDomain),
        ),
      },
      new UUID(model.id),
    ).asOk()

    const medias = model.medias.map((m) => MediaMapper.fromPersistenceToDomain(m))
    incident.addMedias(medias)

    return incident
  }

  static fromDomainToDTO(domain: Incident): IncidentDTO {
    return {
      id: domain.id.toString(),
      title: domain.title,
      coordinate: LocationMapper.fromDomainToDTO(domain.coordinate),
      createdAt: domain.createdAt,
    }
  }

  static fromDomainToPersistence(domain: Incident): IncidentModel {
    return {
      id: domain.id.toString(),
      title: domain.title,
      coordinateLat: new Prisma.Decimal(domain.coordinate.latitude),
      coordinateLng: new Prisma.Decimal(domain.coordinate.longitude),
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
