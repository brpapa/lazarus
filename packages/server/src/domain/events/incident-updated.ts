import Incident from 'src/domain/entities/incident'
import Event from 'src/lib/event'

export interface IncidentUpdatedData {
  title?: string
}

export default class IncidentUpdated extends Event<IncidentUpdatedData> {
  static readonly eventName = 'incident:updated'

  constructor(data: IncidentUpdatedData) {
    super(IncidentUpdated.eventName, data)
  }

  static commit(aggIncident: Incident, event: IncidentUpdated) {
    aggIncident.title = event.data.title ?? aggIncident.title
    aggIncident.updatedAt = event.timestamp
  }
}
