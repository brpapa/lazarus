import { useCallback } from 'react'
import { useMutation } from 'react-relay'
import type { GraphQLTaggedNode, MutationParameters } from 'relay-runtime'

// TODO: returns a promise that returns an Result<Ok, Err>
/** for mutations that returns a result field that is an union between *OkResult and *ErrResult  */
export const useResultMutation = <T extends MutationParameters>(
  mutation: GraphQLTaggedNode,
  name: string,
) => {
  const [commit, isSending] = useMutation<T>(mutation)

  const wrappedCommit = useCallback(
    (wrappedConfig: any) =>
      commit({
        variables: wrappedConfig.variables,
        // request completes successfully
        onCompleted: (response, errors) => {
          if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

          // @ts-ignore
          const result = response[name].result

          // if (result.__typename.endsWith('OkResult')) wrappedConfig.onResult(ok(result))
          // else if (result.__typename.endsWith('ErrResult')) wrappedConfig.onResult(err(result))
          // else throw new Error(`Unexpected result typename: ${result.__typename}`)
        },
        updater: wrappedConfig.updater,
        onError: (error) => {
          // Server errors (5xx HTTP codes, 1xxx WebSocket codes)
          // Client problems e.g. rate-limited, unauthorized, etc. (4xx HTTP codes)
          // The query is missing/malformed
          // The query fails GraphQL internal validation (syntax, schema logic, etc.)
          throw error
        },
        // if was passed a optimisticResponse/optimisticUpdater but the query fails, they are automacally rollbacked.
      }),
    [],
  )

  return [wrappedCommit, isSending]
}
