import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { GraphQLObjectType } from 'graphql'
import { createLoaders } from './loaders'
import { GraphQLContext } from './context'

/** Global state encapsulated */
export class GraphQLCustomTypes {
  private static registeredTypes: Record<string, GraphQLObjectType> = {}

  public static register<S, C>(type: GraphQLObjectType<S, C>): GraphQLObjectType<S, C> {
    this.registeredTypes[type.name] = type
    return type
  }
}

/**
 * Create the node field and node interface to enable caching and data refetching on client.
 * Learn: https://graphql.org/learn/global-object-identification/
 * Relay specs: https://relay.dev/docs/guides/graphql-server-specification/#object-identification
 */
// export const { nodeField, nodeInterface } = nodeDefinitions<GraphQLContext>(
//   (globalId, ctx) => {
//     const { type, id } = fromGlobalId(globalId)

//     const loader = createLoaders()[type] as DataLoader<any, any>

//     // FIXME: aqui o loader nao tem o metodo .load()
//     return (loader && loader.load(ctx, id)) || null
//   },
//   (obj) => registeredTypes[obj.constructor.name] || null,
// )
