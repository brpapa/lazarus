import debug from 'debug'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { ReportIncidentCommand } from './report-incident/command'

const log = debug('app:incident:application')

export const createIncidentCommand = new ReportIncidentCommand(log, incidentRepo)
