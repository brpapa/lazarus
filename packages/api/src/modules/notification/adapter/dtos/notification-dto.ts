import { Connection } from 'graphql-relay'
import type { NotificationCodeEnum } from 'src/modules/notification/domain/models/notification'
import type { LinkedEntityEnum } from 'src/modules/notification/domain/models/notification-link'

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
  seenByTargetUser: boolean
  createdAt?: Date
}

export type NotificationConnectionDTO = Connection<NotificationDTO> & {
  totalCount: number
  notSeenCount: number
}
