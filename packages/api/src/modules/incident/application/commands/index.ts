import debug from 'debug'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { geocodingService } from '../../infra/services'
import { ReportIncidentCommand } from './report-incident-command'

const log = debug('app:incident:application')

export const reportIncidentCommand = new ReportIncidentCommand(
  log,
  incidentRepo,
  userRepo,
  geocodingService,
)
