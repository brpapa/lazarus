import { useCallback, useState } from 'react'
import { RefetchFnDynamic, useRelayEnvironment } from 'react-relay'
import type { KeyType } from 'react-relay/relay-hooks/helpers'
import {
  commitLocalUpdate,
  fetchQuery,
  GraphQLTaggedNode,
  OperationType,
  StoreUpdater,
} from 'relay-runtime'

/** used along with usePaginationFragment or useRefetchableFragment */
export function useRefetchWithoutSuspense<
  TQuery extends OperationType,
  TKey extends KeyType | null,
>(refetch: RefetchFnDynamic<TQuery, TKey>, refreshQuery: GraphQLTaggedNode) {
  const environment = useRelayEnvironment()
  const [isRefetching, setIsRefetching] = useState(false)

  const refetchWithoutSuspend = useCallback(
    (vars: TQuery['variables'], config?: { updater?: StoreUpdater }) => {
      if (isRefetching) return

      setIsRefetching(true)

      // only updates the relay store
      const observable = fetchQuery(environment, refreshQuery, vars)

      observable.subscribe({
        complete: () => {
          setIsRefetching(false)

          // calling refetch with 'network-only' fetchPolicy would re-render the component and cause useRefetchableFragment to suspend, since a network request would be required
          refetch({}, { fetchPolicy: 'store-only' })

          if (config?.updater) commitLocalUpdate(environment, config.updater)
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
