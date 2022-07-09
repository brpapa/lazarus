import debug from 'debug'
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import { GraphQLContext } from 'src/api/graphql/context'
import { pubSub, TOPICS } from 'src/api/graphql/pub-sub'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { locationService } from 'src/modules/user/application/services'
import { IncidentType } from '../types/incident-type'

const log = debug('app:incident:infra')

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

      const shouldSend = await locationService.userIsNearbyToIncident(ctx.userId, payload.incident)
      log(`Should send subscription? ${shouldSend}`)
      return shouldSend
    },
  ),
  resolve: (payload) => IncidentMapper.fromDomainToDTO(payload.incident),
}
