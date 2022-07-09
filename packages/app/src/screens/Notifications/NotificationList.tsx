import { t } from '@lazarus/shared'
import React, { useCallback, useEffect } from 'react'
import { RefreshControl, VirtualizedList } from 'react-native'
import { commitLocalUpdate, graphql, usePaginationFragment, useRelayEnvironment } from 'react-relay'
import { Error, FooterLoadingIndicator } from '~/components/v1'
import { updateProfileTabBarBadgeValue } from '~/data/relay/utils/store'
import { useRefetchWithoutSuspense } from '~/data/relay/utils/use-refetch-without-suspense'
import { NOTIFICATIONS_PAGE_SIZE } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { NotificationListRefreshQuery as NotificationListRefreshQueryType } from '~/__generated__/NotificationListRefreshQuery.graphql'
import NotificationListRefreshQuery from '~/__generated__/NotificationListRefreshQuery.graphql'
import type { NotificationList_query$key } from '~/__generated__/NotificationList_query.graphql'
import { NotificationItem } from './NotificationItem'

// prettier-ignore
const frag = graphql`
  fragment NotificationList_query on Query
    @refetchable(queryName: "NotificationListRefreshQuery")
    @argumentDefinitions(count: { type: "Int!" }, cursor: { type: "String" }) {
    
    me {
      notifications(first: $count, after: $cursor)
        @connection(key: "NotificationList_notifications") {
        notSeenCount
        
        edges {
          node {
            ...NotificationItem_notification
          }
        }
      }
    }
  }
`

type Props = {
  queryRef: NotificationList_query$key
}

export function NotificationList(props: Props) {
  const s = useStyles()

  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment<
    NotificationListRefreshQueryType,
    NotificationList_query$key
  >(frag, props.queryRef)

  const { refetchWithoutSuspend, isRefetching } = useRefetchWithoutSuspense(
    refetch,
    NotificationListRefreshQuery,
  )

  const onRefresh = useCallback(() => {
    refetchWithoutSuspend({
      count: NOTIFICATIONS_PAGE_SIZE,
      cursor: null,
    })
  }, [refetchWithoutSuspend])

  const environment = useRelayEnvironment()

  useEffect(() => {
    const newValue = data.me?.notifications.notSeenCount
    if (!newValue) return
    commitLocalUpdate(environment, (store) => {
      updateProfileTabBarBadgeValue(store, { type: 'SET', value: newValue })
    })
  }, [data.me?.notifications.notSeenCount])

  const loadMore = useCallback(() => {
    if (hasNext) loadNext(NOTIFICATIONS_PAGE_SIZE)
  }, [hasNext, loadNext])

  const nodes = data.me?.notifications.edges
    ? data.me.notifications.edges.flatMap((e) => (e ? [e.node] : []))
    : []

  if (nodes.length === 0) {
    return <Error message={t('notifications.noAvailable') as string} />
  }

  return (
    <VirtualizedList
      data={nodes}
      renderItem={({ item: node }) => <NotificationItem notificationRef={node} />}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      getItem={(nodes, idx) => nodes[idx]}
      getItemCount={(nodes) => nodes.length}
      getItemLayout={(_, idx) => ({ length: 78.7, offset: 78.7 * idx, index: idx })}
      keyExtractor={(_, idx) => `notification-${idx}`}
      onEndReached={loadMore}
      // onEndReachedThreshold={0.1}
      // initialScrollIndex={0}
      ListFooterComponent={<FooterLoadingIndicator isHidden={!isLoadingNext} />}
      style={s.notificationContainer}
    />
  )
}

const useStyles = makeUseStyles(() => ({
  notificationContainer: {
    flex: 1,
    width: '100%',
  },
}))
