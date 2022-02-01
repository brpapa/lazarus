import debug from 'debug'
import { incidentRepo } from '../../infra/db/repositories'
import { IncidentsQuery } from './incidents-query'

const log = debug('app:incident:application')

export { GetIncidentById } from './get-incident-by-id'
export const incidentsQuery = new IncidentsQuery(log, incidentRepo)
