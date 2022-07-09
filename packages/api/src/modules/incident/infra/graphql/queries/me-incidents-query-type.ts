import { GraphQLFieldConfig } from 'graphql'
import { connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { IncidentConnectionDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { incidentsQuery } from 'src/modules/incident/application/queries'
import { IncidentConnectionType } from '../types/incident-type'

export const MeIncidentsQueryType: GraphQLFieldConfig<
  Record<string, never>,
  GraphQLContext,
  any
> = {
  type: IncidentConnectionType,
  args: connectionArgs,
  resolve: async (_, args: ConnectionArguments, ctx): Promise<IncidentConnectionDTO | null> => {
    if (ctx.userId === null) return null
    const { incidents, totalCount } = await incidentsQuery.exec(
      { filter: { userId: ctx.userId } },
      ctx,
    )
    const connection = connectionFromArray(incidents, args)
    return { ...connection, totalCount }
  },
}
