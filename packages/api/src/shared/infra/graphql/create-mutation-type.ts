import {
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLUnionType
} from 'graphql'
import { Result } from 'src/shared/logic/result'

/** create mutation with clientMutationId field based on relay specs */
export function createMutationType<Ctx, Input, Res extends Result<any, any>>(config: {
  name: string
  description?: string
  inputFields: Record<keyof Input, GraphQLInputFieldConfig>
  mutateAndGetResult: (input: Input, ctx: Ctx, info: GraphQLResolveInfo) => Res | Promise<Res>
  okResultFields: Record<string, GraphQLFieldConfig<Res, Ctx>>
  errResultFields: Record<string, GraphQLFieldConfig<Res, Ctx>>
}) {
  const { name, inputFields, okResultFields, errResultFields, mutateAndGetResult } = config

  const MutationInputType = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: {
      ...inputFields,
      clientMutationId: { type: GraphQLString },
    },
  })

  const OkResultType = new GraphQLObjectType<Res>({
    name: `${name}OkResult`,
    fields: {
      ...okResultFields,
    },
  })
  const ErrResultType = new GraphQLObjectType<Res>({
    name: `${name}ErrResult`,
    fields: {
      ...errResultFields,
    },
    // interfaces: [ErrResultInterfaceType],
  })

  const ResultType = new GraphQLUnionType({
    name: `${name}Result`,
    types: [OkResultType, ErrResultType],
    resolveType: (result: Res) => {
      if (result.isOk()) return OkResultType
      if (result.isErr()) return ErrResultType
      throw new Error('Result is neither Ok value nor Err value')
    },
  })

  const MutationOutputType = new GraphQLObjectType({
    name: `${name}Output`,
    fields: {
      result: {
        type: GraphQLNonNull(ResultType),
        resolve: (augmentedResult) => augmentedResult.result,
      },
      clientMutationId: {
        type: GraphQLString,
        resolve: (augmentedResult) => augmentedResult.clientMutationId,
      },
    },
  })

  const mutationType: GraphQLFieldConfig<any, Ctx> = {
    type: GraphQLNonNull(MutationOutputType),
    description: config.description,
    args: {
      input: { type: GraphQLNonNull(MutationInputType) },
    },
    resolve: (_, { input }, ctx, info) => {
      const result = mutateAndGetResult(input, ctx, info)

      return Promise.resolve(result).then((result) => ({
        result,
        clientMutationId: input.clientMutationId,
      }))
    },
  }

  return mutationType
}
