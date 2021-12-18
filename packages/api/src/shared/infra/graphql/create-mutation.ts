import { GraphQLFieldConfig, GraphQLInputFieldConfig } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

type Config<Ctx, Args, Payload> = {
  name: string
  inputFields: Record<keyof Args, GraphQLInputFieldConfig>
  mutateAndGetPayload: (args: Args, ctx: Ctx) => Payload | Promise<Payload>
  outputFields: Record<string, GraphQLFieldConfig<Payload, Ctx>>
}

/** create mutation with clientMutationId field based on relay specs */
export function createMutation<Ctx, Args, Payload>(
  config: Config<Ctx, Args, Payload>,
): GraphQLFieldConfig<any, Ctx> {
  return mutationWithClientMutationId(config)
}
