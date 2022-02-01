import debug from 'debug'
import { notificationRepo } from '../../infra/db/repositories'
import { MarkNotificationAsSeenCommand } from './mark-notification-as-seen-command'
import { MarkAllNotificationsAsSeenCommand } from './mark-all-notifications-as-seen-command'

const log = debug('app:notification:application')

export const markNotificationAsSeenCommand = new MarkNotificationAsSeenCommand(
  log,
  notificationRepo,
)
export const markAllNotificationsAsSeenCommand = new MarkAllNotificationsAsSeenCommand(
  log,
  notificationRepo,
)
