import type { LinkedEntityEnum } from '@notification/domain/models/notification-link'
import type { NotificationCodeEnum } from '@notification/domain/models/notification'

export interface NotificationDTO {
  notificationId: string
  targetUserId: string
  code: NotificationCodeEnum
  title: string
  subtitle: string
  body: string
  link: {
    entity: LinkedEntityEnum
    entityId: string
  }
  seenByTargetUser?: boolean
  createdAt?: Date
}
