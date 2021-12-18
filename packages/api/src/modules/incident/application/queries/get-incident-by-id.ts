import { GraphQLContext } from 'src/infra/http/graphql/context'
import { User } from 'src/modules/user/domain/models/user'
import { IncidentDTO } from '../../adapter/dtos/incident-dto'
import { IncidentMapper } from '../../adapter/mappers/incident-mapper'

export class GetIncidentById {
  static async gen(args: { incidentId: string }, ctx: GraphQLContext): Promise<IncidentDTO | null> {
    const incident = await ctx.loaders.incident.load(args.incidentId)
    return this.canSee(ctx.viewer) ? IncidentMapper.fromDomainToDTO(incident) : null
  }

  // permissions and authorizations lives here
  private static canSee(_viewer: User | null) {
    return true
  }
}
