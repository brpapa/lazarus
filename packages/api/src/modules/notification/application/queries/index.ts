import debug from 'debug'
import { notificationRepo } from '../../infra/db/repositories'
import { GetMyNotifications } from './get-my-notifications'

const log = debug('app:notification:application')

export { GetNotificationById } from './get-notification-by-id'
export const getMyNotifications = new GetMyNotifications(log, notificationRepo)
