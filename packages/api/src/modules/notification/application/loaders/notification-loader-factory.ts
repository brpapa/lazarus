import { INotificationRepo } from '@notification/adapter/repositories/notification-repo'
import { Notification } from '@notification/domain/models/notification'
import { LoaderFactory } from '@shared/application/loader-factory'

export class NotificationLoaderFactory extends LoaderFactory<Notification> {
  constructor(notificationRepo: INotificationRepo) {
    super(notificationRepo, Notification.name)
  }
}
