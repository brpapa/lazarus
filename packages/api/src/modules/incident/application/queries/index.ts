import debug from 'debug'
import { incidentRepo } from '../../infra/db/repositories'
import { GetIncidents } from './get-incidents'

const log = debug('app:incident:application')

export { GetIncidentById } from './get-incident-by-id'
export const getIncidents = new GetIncidents(log, incidentRepo)
