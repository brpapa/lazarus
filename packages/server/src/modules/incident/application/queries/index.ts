import { incidentRepo } from '../../infra/db/repositories'
import { GetIncidentsWithinBoundary } from './get-incidents-within-boundary'

export { GetIncidentById } from './get-indent-by-id'
export const getIncidentsWithinBoundary = new GetIncidentsWithinBoundary(incidentRepo)
