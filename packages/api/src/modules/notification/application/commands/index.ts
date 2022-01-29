import debug from 'debug'
import { notificationRepo } from '../../infra/db/repositories'
import { MarkNotificationAsSeenCommand } from './mark-notification-as-seen-command'

const log = debug('app:notification:application')

export const markNotificationAsSeenCommand = new MarkNotificationAsSeenCommand(
  log,
  notificationRepo,
)
