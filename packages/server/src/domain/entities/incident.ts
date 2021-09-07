import Entity from 'src/lib/entity'
import Location from '../location'

export default class Incident extends Entity {
  public static readonly collection = 'incidents'

  public title: string | null = null
  public location: Location | null = null
  public state: IncidentState | null = null

  #persistedEvents = []
  #pendingEvents = []

  public constructor(persistedEvents = []) {
    super()
    if (persistedEvents.length > 0) {
      this.#persistedEvents = persistedEvents
    }
  }
}
