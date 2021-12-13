import debug from 'debug'
import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { GraphQLObjectType } from 'graphql'
import DataLoader from 'dataloader'
import { GraphQLContext } from './context'

const log = debug('app:infra:http:graphql')

/** Encapsulated global state, containing all custom graphql types defined */
export class GraphQLTypes {
  /** indexed by type name */
  static registeredTypes: Record<string, GraphQLObjectType> = {}

  static register<S, C>(type: GraphQLObjectType<S, C>): GraphQLObjectType<S, C> {
    this.registeredTypes[type.name] = type
    return type
  }
}

/**
 * Create the node field and node interface to enable caching and data refetching on client.
 * Learn: https://graphql.org/learn/global-object-identification/
 * Relay specs: https://relay.dev/docs/guides/graphql-server-specification/#object-identification
 */
export const { nodeField, nodeInterface } = nodeDefinitions<GraphQLContext>(
  // returns an object of a given globalId
  (globalId, ctx) => {
    const { type: typeName, id } = fromGlobalId(globalId)
    log(`resolving an object to the ${typeName} graphql type with id ${id}`)

    // @ts-ignore
    const loader = ctx.loaders[typeName.toLowerCase()] as DataLoader<any, any>
    log(`data loader found: ${loader}`)

    return (loader && loader.load(id)) || null
  },
  // returns the GraphQL type of a given object
  (obj) => {
    return GraphQLTypes.registeredTypes[obj.constructor.name] || null
  },
)
