import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { MeType } from './me-type'

export const MeQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: MeType,
  description: 'Informations related to requester user',
  resolve: (): Record<string, never> => ({}),
}
