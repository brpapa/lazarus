import { incidentRepo } from '../../infra/db/repositories'
import { IncidentLoaderFactory } from './incident-loader'

export const incidentLoaderFactory = new IncidentLoaderFactory(incidentRepo)
