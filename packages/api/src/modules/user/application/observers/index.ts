import debug from 'debug'
import { userRepo } from '../../infra/db/repositories'
import { EnrichIncidentWithNearbyUsersObserver } from './enrich-incident-with-nearby-users'

const log = debug('app:user:application:observer')

new EnrichIncidentWithNearbyUsersObserver(log, userRepo)
