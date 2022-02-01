import { notificationRepo } from 'src/modules/notification/infra/db/repositories'
import debug from 'debug'
import { MyNotificationsQuery } from './my-notifications-query'

const log = debug('app:notification:application')

export { GetNotificationById } from './get-notification-by-id'
export const myNotificationsQuery = new MyNotificationsQuery(log, notificationRepo)
