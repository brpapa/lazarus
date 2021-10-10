import Incident from 'src/domain/entities/incident'
import Event from 'src/shared/event'

export interface IncidentCreatedData {
  title: string
}

export default class IncidentCreated extends Event<IncidentCreatedData> {
  static readonly eventName = 'incident:created'

  constructor(data: IncidentCreatedData) {
    super(IncidentCreated.eventName, data)
  }

  static commit(aggIncident: Incident, event: IncidentCreated) {
    aggIncident.id = event.id
    aggIncident.title = event.data.title
    aggIncident.createdAt = event.timestamp
  }
}
