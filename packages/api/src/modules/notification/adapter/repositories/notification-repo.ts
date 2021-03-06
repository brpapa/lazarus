import { Notification } from 'src/modules/notification/domain/models/notification'
import { IRepository } from 'src/modules/shared/infra/db/repository'

export interface INotificationRepo extends IRepository<Notification> {
  findById(id: string): Promise<Notification | null>
  findByIdBatch(ids: string[]): Promise<(Notification | null)[]>
  findAllOfTargetUserId(targetUserId: string): Promise<Notification[]>
  commit(notification: Notification): Promise<Notification>
  commitBatch(notifications: Notification[]): Promise<Notification[]>
}
