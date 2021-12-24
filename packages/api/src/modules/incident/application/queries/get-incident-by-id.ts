import { GraphQLContext } from 'src/infra/graphql/context'
import { IncidentDTO } from '../../adapter/dtos/incident-dto'
import { IncidentMapper } from '../../adapter/mappers/incident-mapper'

export class GetIncidentById {
  static async gen(args: { incidentId: string }, ctx: GraphQLContext): Promise<IncidentDTO | null> {
    const incident = await ctx.loaders.incident.load(args.incidentId)
    return this.canSee(ctx.userId) ? IncidentMapper.fromDomainToDTO(incident) : null
  }

  // permissions and authorizations lives here
  private static canSee(userId: string | null) {
    return true
  }
}
