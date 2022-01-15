import React, { useCallback } from 'react'
import { RefreshControl } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { graphql, usePaginationFragment } from 'react-relay'
import { useRefetchWithoutSuspense } from '~/data/relay/utils/use-refetch-without-suspense'
import type { NotificationListRefreshQuery as NotificationListRefreshQueryType } from '~/__generated__/NotificationListRefreshQuery.graphql'
import NotificationListRefreshQuery from '~/__generated__/NotificationListRefreshQuery.graphql'
import type { NotificationList_query$key } from '~/__generated__/NotificationList_query.graphql'
import { Notification } from './Notification'

const PAGE_SIZE = 10

type NotificationsListProps = {
  queryRef: NotificationList_query$key
}

// prettier-ignore
const frag = graphql`
  fragment NotificationList_query on Query
    @refetchable(queryName: "NotificationListRefreshQuery")
    @argumentDefinitions(count: { type: "Int!" }, cursor: { type: "String" }) {
    
    notifications: myNotifications(first: $count, after: $cursor)
      @connection(key: "NotificationList_notifications") {
      
      notSeenCount
      edges {
        node {
          ...Notification_notification
        }
      }
    }
  }
`

export function NotificationList(props: NotificationsListProps) {
  const { data, hasNext, loadNext, refetch } = usePaginationFragment<
    NotificationListRefreshQueryType,
    NotificationList_query$key
  >(frag, props.queryRef)

  const { refetchWithoutSuspend, isRefetching } = useRefetchWithoutSuspense(
    refetch,
    NotificationListRefreshQuery,
  )

  const onRefresh = useCallback(() => {
    refetchWithoutSuspend({
      count: PAGE_SIZE,
      cursor: null,
    })
  }, [refetchWithoutSuspend])

  const onEndReached = useCallback(() => {
    if (hasNext) loadNext(PAGE_SIZE)
  }, [hasNext, loadNext])

  const nodes = data.notifications.edges
    ? data.notifications.edges.flatMap((e) => (e ? [e.node] : []))
    : []

  return (
    <FlatList
      style={{ flex: 1 }}
      data={nodes}
      renderItem={({ item: node }) => <Notification notificationRef={node} />}
      keyExtractor={(_, i) => i.toString()}
      onEndReachedThreshold={0}
      onEndReached={onEndReached}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      // TODO
      // ItemSeparatorComponent={() => <View style={styles.separator} />}
      // ListFooterComponent={this.renderFooter}
    />
  )
}

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
