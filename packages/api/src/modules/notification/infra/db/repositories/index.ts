import debug from 'debug'
import { prismaClient } from 'src/api/db/prisma/client'
import { DeviceRepo } from './device-repo'
import { NotificationRepo } from './notification-repo'

const log = debug('app:notifications:infra')

export const deviceRepo = new DeviceRepo(log, prismaClient)
export const notificationRepo = new NotificationRepo(log, prismaClient)
