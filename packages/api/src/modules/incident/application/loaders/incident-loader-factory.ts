import { Incident } from '@incident/domain/models/incident'
import { IIncidentRepo } from '@incident/adapter/repositories/incident-repo'
import { LoaderFactory } from '@shared/application/loader-factory'

export class IncidentLoaderFactory extends LoaderFactory<Incident> {
  constructor(incidentRepo: IIncidentRepo) {
    super(incidentRepo, Incident.name)
  }
}
