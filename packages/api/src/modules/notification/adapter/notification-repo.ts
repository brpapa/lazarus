import { Notification } from '@notification/domain/notification'

export interface INotificationRepo {
  commit(notification: Notification): Promise<Notification>
  commitBatch(notifications: Notification[]): Promise<Notification[]>
}
