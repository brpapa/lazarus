import { t } from '@metis/shared'
import React, { useCallback } from 'react'
import { RefreshControl, VirtualizedList } from 'react-native'
import { graphql, usePaginationFragment } from 'react-relay'
import { Error } from '~/components/v1/atoms/Error'
import { FooterLoadingIndicator } from '~/components/v1/molecules'
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
    
    notifications: myNotifications(first: $count, after: $cursor)
      @connection(key: "NotificationList_notifications") {
      
      edges {
        node {
          ...NotificationItem_notification
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

  const loadMore = useCallback(() => {
    if (hasNext) loadNext(NOTIFICATIONS_PAGE_SIZE)
  }, [hasNext, loadNext])

  const nodes = data.notifications.edges
    ? data.notifications.edges.flatMap((e) => (e ? [e.node] : []))
    : []

  if (nodes.length === 0) {
    return <Error message={t('No notifications available') as string} />
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

/*
const onRefresh = useCallback(() => {
    refetchWithoutSuspend(
      {
        count: PAGE_SIZE,
        cursor: null,
      },
      // FIXME: seria bom atualizar o badge do tab caso notSeenCount viesse diferente, porem dessa forma abaixo o data.notifications.notSeenCount vem desatualizado no primeiro refetch, só no segundo vem o valor atual
      // or use myNotificationsRecord.invalidateRecord() to mark as stale: https://relay.dev/docs/guided-tour/reusing-cached-data/staleness-of-data/
      {
        updater: (store) => {
          const myNotificationsRecord = store.getRoot().getLinkedRecord('myNotifications')
          if (!myNotificationsRecord) throw new Error('Not found root.myNotifications record')

          myNotificationsRecord.setValue(data.notifications.notSeenCount, 'notSeenCount')
        },
      },
    )
  }, [refetchWithoutSuspend])
*/
