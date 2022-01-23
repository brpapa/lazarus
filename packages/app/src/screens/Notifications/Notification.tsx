import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { graphql, useFragment } from 'react-relay'
import { Text } from '~/components/v1/atoms'
import { useSeeNotificationMutation } from '~/data/relay/mutations/SeeNotificationMutation'
import { makeUseStyles } from '~/theme/v1'
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
  const s = useStyles()
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
      <View style={s.container}>
        <Text>{data.title}</Text>
        <Text>{data.subtitle}</Text>
        <Text>{data.body}</Text>
        <Text>{data.seenByTargetUser ? 'seen' : 'not seen'}</Text>
        <Text>{t('formatters.relativeTimeToNow', { time: new Date(data.createdAt) }) as string}</Text>
      </View>
    </TouchableOpacity>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.accent1,
    marginVertical: spacing.m,
  },
}))
