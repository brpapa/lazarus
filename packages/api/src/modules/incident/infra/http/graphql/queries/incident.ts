import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { IncidentType } from '../types/incident'

export const IncidentQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: IncidentType,
  args: {
    id: {
      description: 'The incident id',
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (_, args: { id: string }, ctx): Promise<IncidentDTO | null> => {
    return GetIncidentById.gen(args, ctx)
  },
}
