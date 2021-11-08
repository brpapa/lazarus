import { GraphQLContext } from 'src/infra/http/graphql/context'
import { CoordinateDTO } from '../../../../shared/adapter/dtos/coordinate'
import { IncidentDTO } from '../../adapter/dtos/incident'
import { IncidentMapper } from '../../adapter/mappers/incident'
import { Coordinate } from '../../../../shared/domain/models/coordinate'
import { incidentRepo } from '../../infra/db/repositories'

export class GetNearbyIncidents {
  static async gen(
    args: { centerCoordinate: CoordinateDTO; radius: number },
    ctx: GraphQLContext,
  ): Promise<IncidentDTO[]> {
    const coord = Coordinate.create(args.centerCoordinate).asOk() // TODO
    const nearbyIncidents = await incidentRepo.findNearbyTo(coord, args.radius)
    return nearbyIncidents.map((incident) => IncidentMapper.fromDomainToDTO(incident))
  }

  private static canSee() {
    return true
  }
}
