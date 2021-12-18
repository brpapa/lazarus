import { incidentRepo } from '../../infra/db/repositories'
import { GetIncidents } from './get-incidents'

export { GetIncidentById } from './get-incident-by-id'
export const getIncidentsWithinBoundary = new GetIncidents(incidentRepo)
