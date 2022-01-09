import { PrismaClient } from '@prisma/client'
import { Debugger } from 'debug'
import { INotificationRepo } from '@notification/adapter/notification-repo'
import { NotificationMapper } from '@notification/adapter/mappers/notification-mapper'
import { Notification } from '@notification/domain/models/notification'
import { PrismaRepo } from '@shared/infra/db/prisma-repo'

export class NotificationRepo extends PrismaRepo<Notification> implements INotificationRepo {
  constructor(private log: Debugger, private prismaClient: PrismaClient) {
    super('notificationModel')
  }

  async commit(notification: Notification): Promise<Notification> {
    const notificationModel = NotificationMapper.fromDomainToPersistence(notification)

    const isNew = !(await this.exists(notification))
    if (isNew) {
      this.log('Persisting a new notification on Pg: %o', notification.id.toString())
      await this.prismaClient.notificationModel.create({ data: notificationModel })
    } else {
      this.log('Persisting an updated notification on Pg: %o', notification.id.toString())
      await this.prismaClient.notificationModel.update({
        where: { id: notification.id.toString() },
        data: notificationModel,
      })
    }

    return notification
  }

  async commitBatch(notifications: Notification[]): Promise<Notification[]> {
    return Promise.all(notifications.map((notification) => this.commit(notification)))
  }
}
