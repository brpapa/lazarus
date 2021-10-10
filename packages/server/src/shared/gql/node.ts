import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import DataLoader from 'dataloader'
import { GraphQLObjectType } from 'graphql'

import loaders from '../../presentation/schema/loaders'
import { GraphQLContext } from '../../presentation/type-declarations'

const registeredTypes: Record<string, GraphQLObjectType> = {}

export function registerType(type: GraphQLObjectType): GraphQLObjectType {
  registeredTypes[type.name] = type
  return type
}

type Loader = {
  load: (ctx: GraphQLContext, id: string) => Promise<any>
  createLoader: () => DataLoader<string, any>
}

export type Loaders = {
  [key: string]: Loader
}

/**
 * Create the node field and node interface to enable caching and data refetching.
 * Learn: https://graphql.org/learn/global-object-identification/
 * Relay specs: https://relay.dev/docs/guides/graphql-server-specification/#object-identification
 */
export const { nodeField, nodeInterface } = nodeDefinitions<GraphQLContext>(
  (globalId, ctx) => {
    const { type, id } = fromGlobalId(globalId)

    // @ts-ignore
    const loader: Loader = (loaders as Loaders)[`${type}Loader`]

    // FIXME: aqui o loader nao tem o metodo .load()
    return (loader && loader.load(ctx, id)) || null
  },
  (obj) => registeredTypes[obj.constructor.name] || null,
)
