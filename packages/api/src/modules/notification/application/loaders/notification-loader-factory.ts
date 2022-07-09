import { INotificationRepo } from 'src/modules/notification/adapter/repositories/notification-repo'
import { Notification } from 'src/modules/notification/domain/models/notification'
import { LoaderFactory } from 'src/modules/shared/application/loader-factory'

export class NotificationLoaderFactory extends LoaderFactory<Notification> {
  constructor(notificationRepo: INotificationRepo) {
    super(notificationRepo, Notification.name)
  }
}
