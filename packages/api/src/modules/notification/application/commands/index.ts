import debug from 'debug'
import { notificationRepo } from '../../infra/db/repositories'
import { SeeNotificationCommand } from './see-notification-command'

const log = debug('app:notification:application')

export const seeNotificationCommand = new SeeNotificationCommand(log, notificationRepo)
