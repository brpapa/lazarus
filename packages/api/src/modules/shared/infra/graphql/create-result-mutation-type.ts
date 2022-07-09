import { Result } from '@lazarus/shared'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql'
import { BaseError } from '../../logic/errors'

/** create mutation based on relay specs and with Result (ok xor err) output type */
export function createResultMutationType<Ctx, Input, Res extends Result<any, BaseError>>(config: {
  name: string
  description?: string
  inputFields: Record<keyof Input, GraphQLInputFieldConfig>
  mutateAndGetResult: (input: Input, ctx: Ctx, info: GraphQLResolveInfo) => Res | Promise<Res>
  okFields: Record<string, GraphQLFieldConfig<Res, Ctx>>
  errors: typeof BaseError[]
}) {
  const { name, mutateAndGetResult, errors } = config
  const inputFields = extractInputFields(config)
  const okFields = extractOkFields(config)

  const MutationInputType = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: inputFields,
  })

  const OkResultType = new GraphQLObjectType<Res>({
    name: `${name}OkResult`,
    fields: okFields,
  })
  const ErrResultType = new GraphQLObjectType<Res>({
    name: `${name}ErrResult`,
    // interfaces: [ErrResultInterfaceType],
    fields: {
      reason: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asErr().reason,
      },
      reasonIsTranslated: {
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: (res) => res.asErr().reasonIsTranslated,
      },
      code: {
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: `${name}ErrCodeType`,
            values: Object.fromEntries(errors.map((e) => [e.name, { value: e.name }])),
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
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

// workaround to fix troubles when inputFields is an empty object
const extractInputFields = (config: {
  inputFields: Record<string, GraphQLInputFieldConfig>
}): Record<string, GraphQLInputFieldConfig> => {
  if (config.inputFields === undefined || Object.keys(config.inputFields).length === 0)
    return { _: { type: GraphQLString } }
  return config.inputFields
}

// workaround to fix troubles when okFields is an empty object
const extractOkFields = <Res, Ctx>(config: {
  okFields: Record<string, GraphQLFieldConfig<Res, Ctx>>
}): Record<string, GraphQLFieldConfig<Res, Ctx>> => {
  if (config.okFields === undefined || Object.keys(config.okFields).length === 0)
    return {
      _: {
        type: GraphQLNonNull(GraphQLString),
        resolve: () => 'void',
      },
    }
  return config.okFields
}
