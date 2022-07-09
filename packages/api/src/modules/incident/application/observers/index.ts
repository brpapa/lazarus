import { UpdateIncidentStatisticsObserver } from './update-incident-statistics-observer'
import { PropagateToSubscriptionObserver } from './propagate-to-subscription-observer'
import { incidentRepo } from '../../infra/db/repositories'

new UpdateIncidentStatisticsObserver(incidentRepo)
new PropagateToSubscriptionObserver()
