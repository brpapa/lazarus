import { incidentRepo } from 'src/modules/incident/infra/db/incident-repo'
import { CreateIncidentCommand } from './command'

export const createIncidentCommand = new CreateIncidentCommand(incidentRepo)

export * as ReportNewIncidentErrors from './errors'
