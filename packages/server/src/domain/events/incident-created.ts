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

// - `incident:submitted`
//     - review antes de publicar?
//     - publicar midias no s3
// - `incident:opened`
//     - atualizar quad tree
//     - notificar usuarios que ouvem locais das proximidades
//     - notificar usuarios que estao nas proximidades
//     - atualizar o mapa em tempo real de todos os usuarios logados no app, mas que estao nas proximidades
//     - abrir chat para o incidente
// - `incident:closed`
// - `incident:timelineUpdated`
// - `incident:newReaction`
// - `incident:chat:newMessage`
