import { Result } from '@metis/shared'
import {
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql'

/** create mutation based on relay specs and with Result (ok xor err) output type */
export function createResultMutationType<Ctx, Input, Res extends Result<any, any>>(config: {
  name: string
  description?: string
  inputFields: Record<keyof Input, GraphQLInputFieldConfig>
  mutateAndGetResult: (input: Input, ctx: Ctx, info: GraphQLResolveInfo) => Res | Promise<Res>
  resultFields: {
    ok: Record<string, GraphQLFieldConfig<Res, Ctx>>
    err: Record<string, GraphQLFieldConfig<Res, Ctx>>
  }
}) {
  const { name, inputFields, resultFields, mutateAndGetResult } = config

  const MutationInputType = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: {
      ...inputFields,
      clientMutationId: { type: GraphQLString }, // legacy, but removing it cause troubles when inputFields is an empty object
    },
  })

  const OkResultType = new GraphQLObjectType<Res>({
    name: `${name}OkResult`,
    fields: resultFields.ok,
  })
  const ErrResultType = new GraphQLObjectType<Res>({
    name: `${name}ErrResult`,
    fields: resultFields.err,
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

  const mutationType: GraphQLFieldConfig<any, Ctx> = {
    type: GraphQLNonNull(ResultType),
    description: config.description,
    args: {
      input: { type: GraphQLNonNull(MutationInputType) },
    },
    resolve: (_, { input }, ctx, info) => {
      const result = mutateAndGetResult(input, ctx, info)
      return Promise.resolve(result)
    },
  }

  return mutationType
}
