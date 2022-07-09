import { incidentRepo } from '../../infra/db/repositories'
import { IncidentLoaderFactory } from './incident-loader-factory'

export const incidentLoaderFactory = new IncidentLoaderFactory(incidentRepo)
