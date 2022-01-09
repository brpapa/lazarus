import { NotificationMapper } from '@notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from '@notification/adapter/repositories/notification-repo'
import { Notification } from '@notification/domain/models/notification'
import { PrismaClient } from '@prisma/client'
import { PrismaRepo } from '@shared/infra/db/prisma-repo'
import { Debugger } from 'debug'

export class NotificationRepo extends PrismaRepo<Notification> implements INotificationRepo {
  constructor(private log: Debugger, private prismaClient: PrismaClient) {
    super('notificationModel')
  }

  async findById(id: string): Promise<Notification | null> {
    const notificationModel = await this.prismaClient.notificationModel.findUnique({
      where: { id },
    })
    if (notificationModel === null) return null
    return NotificationMapper.fromModelToDomain(notificationModel)
  }

  async findByIdBatch(ids: string[]): Promise<(Notification | null)[]> {
    const notifications = await this.prismaClient.notificationModel.findMany({
      where: { id: { in: ids } },
    })
    const orderedNotifications = ids.map((id) => notifications.find((v) => v.id === id) ?? null)
    return orderedNotifications.map((notification) =>
      notification === null ? null : NotificationMapper.fromModelToDomain(notification),
    )
  }

  async findAllOfTargetUserId(targetUserId: string): Promise<Notification[]> {
    const notifications = await this.prismaClient.notificationModel.findMany({
      where: { targetUserId },
    })
    return notifications.map(NotificationMapper.fromModelToDomain)
  }

  async commit(notification: Notification): Promise<Notification> {
    const notificationModel = NotificationMapper.fromDomainToModel(notification)

    this.log('Persisting a new or updated notification on Pg: %o', notification.id.toString())
    await this.prismaClient.notificationModel.upsert({
      where: { id: notification.id.toString() },
      create: notificationModel,
      update: notificationModel,
    })

    return notification
  }

  async commitBatch(notifications: Notification[]): Promise<Notification[]> {
    return Promise.all(notifications.map((notification) => this.commit(notification)))
  }
}
