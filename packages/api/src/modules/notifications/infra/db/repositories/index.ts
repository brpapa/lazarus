import debug from 'debug'
import { prismaClient } from 'src/api/db/prisma/client'
import { ActiveClientsRepo } from './active-clients-repo'
import { DeviceRepo } from './device-repo'

const log = debug('app:notifications:infra')

export const activeClientsRepo = new ActiveClientsRepo()
export const deviceRepo = new DeviceRepo(log, prismaClient)
