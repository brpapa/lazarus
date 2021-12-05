import { incidentRepo } from 'src/modules/incident/infra/db/repositories'
import { CreateIncidentCommand } from './create-incident/command'

export const createIncidentCommand = new CreateIncidentCommand(incidentRepo)
