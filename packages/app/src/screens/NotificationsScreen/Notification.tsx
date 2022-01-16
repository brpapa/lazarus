import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { graphql, useFragment } from 'react-relay'
import { Box, Text } from '~/components/atomics'
import { useSeeNotificationMutation } from '~/data/relay/mutations/SeeNotificationMutation'
import type { Notification_notification$key } from '~/__generated__/Notification_notification.graphql'

type NotificationProps = {
  notificationRef: Notification_notification$key
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
  const data = useFragment<Notification_notification$key>(frag, props.notificationRef)

  const navigation = useNavigation()
  const [seeNotification] = useSeeNotificationMutation()

  const onPressed = useCallback(async () => {
    switch (data.link.entity) {
      case 'INCIDENT':
        navigation.navigate('Incident', { incidentId: data.link.entityId })
        break
      default:
        console.warn(`Link to entity ${data.link.entity} is not implemented yet`)
        break
    }

    if (!data.seenByTargetUser) await seeNotification({ notificationId: data.notificationId })
  }, [
    data.link.entity,
    data.link.entityId,
    data.notificationId,
    data.seenByTargetUser,
    navigation,
    seeNotification,
  ])

  return (
    <TouchableOpacity onPress={onPressed}>
      <Box flex={1} backgroundColor={'accents-1'} marginVertical={'sm'}>
        <Text>{data.title}</Text>
        <Text>{data.subtitle}</Text>
        <Text>{data.body}</Text>
        <Text>{data.seenByTargetUser ? 'seen' : 'not seen'}</Text>
        <Text>{t('notification.createdAt', { createdAt: new Date(data.createdAt) })}</Text>
      </Box>
    </TouchableOpacity>
  )
}
