import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { graphql, useFragment } from 'react-relay'
import type { NotificationsScreen_query$key } from '~/__generated__/NotificationsScreen_query.graphql'
import { NotificationList } from './NotificationList'

type NotificationsScreenProps = {
  query: NotificationsScreen_query$key
}

const frag = graphql`
  fragment NotificationsScreen_query on Query {
    ...NotificationList_query
  }
`

export function NotificationsScreen(props: NotificationsScreenProps) {
  const data = useFragment<NotificationsScreen_query$key>(frag, props.query)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NotificationList query={data} />
    </SafeAreaView>
  )
}
