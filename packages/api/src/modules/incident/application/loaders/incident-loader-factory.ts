import { Incident } from 'src/modules/incident/domain/models/incident'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { LoaderFactory } from 'src/shared/application/loader-factory'

export class IncidentLoaderFactory extends LoaderFactory<Incident> {
  constructor(incidentRepo: IIncidentRepo) {
    super(incidentRepo, Incident.name)
  }
}
