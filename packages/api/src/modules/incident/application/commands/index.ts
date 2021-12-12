import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { ReportIncidentCommand } from './report-incident/command'

export const createIncidentCommand = new ReportIncidentCommand(incidentRepo)
