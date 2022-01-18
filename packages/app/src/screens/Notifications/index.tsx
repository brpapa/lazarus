import { t } from '@metis/shared'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { graphql, useFragment } from 'react-relay'
import { Text } from '~/components/v0-legacy/atoms'
import type { Notifications_query$key } from '~/__generated__/Notifications_query.graphql'
import { NotificationList } from './NotificationList'

type NotificationsProps = {
  queryRef: Notifications_query$key
}

const frag = graphql`
  fragment Notifications_query on Query {
    ...NotificationList_query @arguments(count: 10, cursor: null)
  }
`

export function Notifications(props: NotificationsProps) {
  const data = useFragment<Notifications_query$key>(frag, props.queryRef)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text variant="header" m="md">
        {t('notifications.title')}
      </Text>
      <NotificationList queryRef={data} />
    </SafeAreaView>
  )
}
