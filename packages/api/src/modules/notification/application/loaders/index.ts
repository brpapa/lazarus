import { notificationRepo } from '../../infra/db/repositories'
import { NotificationLoaderFactory } from './notification-loader-factory'

export const notificationLoaderFactory = new NotificationLoaderFactory(notificationRepo)
