import { NotificationModel } from '@prisma/client'
import { Notification } from '@notification/domain/models/notification'
import { UUID } from '@shared/domain/models/uuid'
import { NotificationLink } from '../../domain/models/notification-link'

export class NotificationMapper {
  static fromPersistenceToDomain(model: NotificationModel): Notification {
    return Notification.create(
      {
        targetUserId: model.targetUserId,
        type: model.type,
        title: model.title,
        subtitle: model.subtitle,
        body: model.body,
        link: NotificationLink.create({ entity: model.linkEntity, entityId: model.linkEntityId }),
        seen: model.seen,
        createdAt: model.createdAt,
      },
      new UUID(model.id),
    )
  }

  static fromDomainToPersistence(domain: Notification): NotificationModel {
    return {
      id: domain.id.toString(),
      targetUserId: domain.targetUserId,
      type: domain.type,
      title: domain.title,
      subtitle: domain.subtitle,
      body: domain.body,
      linkEntity: domain.link.entity,
      linkEntityId: domain.link.entityId,
      seen: domain.seen,
      createdAt: domain.createdAt,
    }
  }
}
