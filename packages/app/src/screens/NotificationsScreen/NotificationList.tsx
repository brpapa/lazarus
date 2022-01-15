import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { graphql, useFragment } from 'react-relay'
import type { NotificationList_query$key } from '~/__generated__/NotificationList_query.graphql'
import { Notification } from './Notification'

type NotificationsListProps = {
  query: NotificationList_query$key
}

const frag = graphql`
  fragment NotificationList_query on Query {
    notifications: myNotifications(first: 10) @connection(key: "NotificationList_notifications") {
      edges {
        node {
          ...Notification_notification
        }
      }
    }
  }
`

export function NotificationList(props: NotificationsListProps) {
  const data = useFragment<NotificationList_query$key>(frag, props.query)

  const nodes = data.notifications.edges
    ? data.notifications.edges.flatMap((e) => (e ? [e.node] : []))
    : []

  return (
    <FlatList
      style={{ flex: 1 }}
      data={nodes}
      renderItem={({ item }) => <Notification notification={item} />}
      keyExtractor={(_, i) => i.toString()}
      // TODO
      // onEndReached={this.onEndReached}
      // onRefresh={() => refetch({})}
      // refreshing={this.state.isFetchingTop}
      // ItemSeparatorComponent={() => <View style={styles.separator} />}
      // ListFooterComponent={this.renderFooter}
    />
  )
}
