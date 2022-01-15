import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { graphql, useFragment } from 'react-relay'
import { Box, Text } from '~/components/atomics'
import { useSeeNotificationMutation } from '~/data/relay/mutations/SeeNotificationMutation'
import type { Notification_notification$key } from '~/__generated__/Notification_notification.graphql'

type NotificationProps = {
  notification: Notification_notification$key
}

const frag = graphql`
  fragment Notification_notification on Notification {
    notificationId
    targetUserId
    code
    title
    subtitle
    body
    link {
      entity
      entityId
    }
    seenByTargetUser
    createdAt
  }
`

export function Notification(props: NotificationProps) {
  const data = useFragment<Notification_notification$key>(frag, props.notification)

  const navigation = useNavigation()
  const [seeNotification] = useSeeNotificationMutation()

  const onNotificationPressed = useCallback(
    async (notificationId: string) => {
      seeNotification({ notificationId })

      switch (data.link.entity) {
        case 'INCIDENT':
          navigation.navigate('Incident', { incidentId: data.link.entityId })
          return
        default:
          console.warn(`Link to entity ${data.link.entity} is not implemented yet`)
          return
      }
    },
    [data.link, navigation, seeNotification],
  )

  return (
    <Box flex={1}>
      <Text>{data.title}</Text>
      <Text>{data.subtitle}</Text>
      <Text>{data.body}</Text>
      <Text>{data.seenByTargetUser}</Text>
      <Text>{data.createdAt}</Text>
    </Box>
  )
}
