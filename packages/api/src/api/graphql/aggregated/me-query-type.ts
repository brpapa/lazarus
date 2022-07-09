import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { MeType } from './me-type'

export const MeQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: MeType,
  description: 'Informations related to requester user',
  resolve: (_, __, ctx): Record<string, never> | null => {
    if (ctx.userId === null) return null
    return {}
  },
}
