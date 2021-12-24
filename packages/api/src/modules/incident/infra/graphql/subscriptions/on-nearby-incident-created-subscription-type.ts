import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import { GraphQLContext } from 'src/infra/graphql/context'
import { pubSub, TOPICS } from 'src/infra/graphql/pub-sub'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { locationService } from 'src/modules/user/services'
import { IncidentType } from '../types/incident-type'

export const OnNearbyIncidentCreatedSubscriptionType: GraphQLFieldConfig<
  IncidentCreated,
  GraphQLContext,
  any
> = {
  type: GraphQLNonNull(IncidentType),
  description: 'Triggered whenever a incident is created nearby to the subscriber user',
  subscribe: withFilter(
    () => pubSub.asyncIterator(TOPICS.INCIDENT.CREATED),
    async (payload: IncidentCreated, _variables, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new Error('All subscriptions should be authenticated')

      if (ctx.userId === payload.incident.ownerUserId.toString()) return true

      const shouldNofity = await locationService.userIsNearbyToIncident(
        ctx.userId,
        payload.incident,
      )

      return shouldNofity
    },
  ),
  resolve: (payload) => IncidentMapper.fromDomainToDTO(payload.incident),
}
