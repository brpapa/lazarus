import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { Notification } from '@notification/domain/models/notification'
import { NotificationLink } from '@notification/domain/models/notification-link'
import { NotificationModel } from '@prisma/client'
import { UUID } from '@shared/domain/models/uuid'

export class NotificationMapper {
  static fromDomainToDTO(domain: Notification): NotificationDTO {
    return {
      notificationId: domain.id.toString(),
      targetUserId: domain.targetUserId,
      code: domain.code,
      title: domain.title,
      subtitle: domain.subtitle,
      body: domain.body,
      link: {
        entity: domain.link.entity,
        entityId: domain.link.entityId,
      },
      seenByTargetUser: domain.seenByTargetUser,
      createdAt: domain.createdAt,
    }
  }

  static fromModelToDomain(model: NotificationModel): Notification {
    return Notification.create(
      {
        targetUserId: model.targetUserId,
        code: model.code,
        title: model.title,
        subtitle: model.subtitle,
        body: model.body,
        link: NotificationLink.create({ entity: model.linkEntity, entityId: model.linkEntityId }),
        seenByTargetUser: model.seenByTargetUser,
        createdAt: model.createdAt,
      },
      new UUID(model.id),
    )
  }

  static fromDomainToModel(domain: Notification): NotificationModel {
    return {
      id: domain.id.toString(),
      targetUserId: domain.targetUserId,
      code: domain.code,
      title: domain.title,
      subtitle: domain.subtitle,
      body: domain.body,
      linkEntity: domain.link.entity,
      linkEntityId: domain.link.entityId,
      seenByTargetUser: domain.seenByTargetUser,
      createdAt: domain.createdAt,
    }
  }
}
