import { useCallback, useState } from 'react'
import { RefetchFnDynamic, useRelayEnvironment } from 'react-relay'
import type { KeyType } from 'react-relay/relay-hooks/helpers'
import { fetchQuery, GraphQLTaggedNode, OperationType } from 'relay-runtime'

/** used along with usePaginationFragment or useRefetchableFragment */
export function useRefetchWithoutSuspense<
  TQuery extends OperationType,
  TKey extends KeyType | null,
>(refetch: RefetchFnDynamic<TQuery, TKey>, refreshQuery: GraphQLTaggedNode) {
  const environment = useRelayEnvironment()
  const [isRefetching, setIsRefetching] = useState(false)

  const refetchWithoutSuspend = useCallback(
    (vars: TQuery['variables']) => {
      if (isRefetching) return

      setIsRefetching(true)

      // only updates the relay store
      const observable = fetchQuery(environment, refreshQuery, vars)

      observable.subscribe({
        complete: () => {
          setIsRefetching(false)

          // calling refetch with 'network-only' fetchPolicy would re-render the component and cause useRefetchableFragment to suspend, since a network request would be required
          refetch({}, { fetchPolicy: 'store-only' })
        },
        error: () => {
          console.error('Error to refetch')
          setIsRefetching(false)
        },
      })
    },
    [environment, isRefetching, refreshQuery, refetch],
  )

  return { refetchWithoutSuspend, isRefetching }
}
