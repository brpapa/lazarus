import debug from 'debug'
import { incidentRepo } from '@incident/infra/db/repositories'
import { userRepo } from '@user/infra/db/repositories'
import { geocodingService } from '../../infra/services'
import { ReportIncidentCommand } from './report-incident-command'

const log = debug('app:incident:application')

export const reportIncidentCommand = new ReportIncidentCommand(
  log,
  incidentRepo,
  userRepo,
  geocodingService,
)
