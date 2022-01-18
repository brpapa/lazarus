import { err, ok, Result } from '@metis/shared'
import { useCallback } from 'react'
import { useMutation } from 'react-relay'
import type { GraphQLTaggedNode, MutationParameters, SelectorStoreUpdater } from 'relay-runtime'

type Config<TMutation extends MutationParameters, TInput> = {
  mutation: GraphQLTaggedNode
  mutationName: string
  resultTypenamePreffix: string
  inputMapper?: (input: TInput) => any | Promise<any>
  /** define how update the relay store after a successfull response */
  updater?: SelectorStoreUpdater<TMutation['response']>
  /** if was passed but the query fails, they are automatically rollbacked */
  optimisticUpdater?: SelectorStoreUpdater<TMutation['response']>
  /** if was passed but the query fails, they are automatically rollbacked */
  optimisticResponse?: TMutation['rawResponse']
}

/** a wrapper around useMutation */
export function createResultMutationHook<
  TMutation extends MutationParameters,
  TInput = {},
  TOkResult = {},
  TErrResult = {},
>(config: Config<TMutation, TInput>) {
  return function useResultMutation() {
    const [commit, isSending] = useMutation<TMutation>(config.mutation)

    const commitAsync = useCallback(
      async (input: TInput) => {
        const mappedInput = await (config.inputMapper
          ? Promise.resolve(config.inputMapper(input))
          : Promise.resolve(input))

        return new Promise<Result<TOkResult, TErrResult>>((resolve, reject) => {
          commit({
            variables: { input: mappedInput },
            onCompleted: (response, errors) => {
              if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

              const output = (response as any)[config.mutationName]
              if (!output) throw new Error(`Mutation ${config.mutationName} not exists`)

              const result = output.result
              if (!result)
                throw new Error(
                  `Output of mutation ${config.mutationName} not contains 'result' field`,
                )

              if (result.__typename === `${config.resultTypenamePreffix}OkResult`) {
                resolve(ok(result as TOkResult))
              } else if (result.__typename === `${config.resultTypenamePreffix}ErrResult`) {
                resolve(err(result as TErrResult))
              } else {
                reject(
                  new Error(
                    `Unexpected ${config.mutationName}.result typename: ${result.__typename}`,
                  ),
                )
              }
            },
            onError: (error) => {
              // Server errors (5xx HTTP codes, 1xxx WebSocket codes)
              // Client problems e.g. rate-limited, unauthorized, etc. (4xx HTTP codes)
              // The query is missing/malformed
              // The query fails GraphQL internal validation (syntax, schema logic, etc.)
              console.error(error)
              reject(new Error(`Error with ${config.mutationName} mutation`))
            },
            updater: config.updater,
            optimisticUpdater: config.optimisticUpdater,
            optimisticResponse: config.optimisticResponse,
          })
        })
      },
      [commit],
    )

    return [commitAsync, isSending] as const
  }
}
