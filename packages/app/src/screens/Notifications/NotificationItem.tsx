import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { graphql, useFragment } from 'react-relay'
import { Divider, Dot, Icon, Text } from '~/components/v1'
import { useMarkNotificationAsSeenMutation } from '~/data/relay/mutations/MarkNotificationAsSeenMutation'
import type { MainStackNavProp } from '~/navigation/types'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { NotificationItem_notification$key } from '~/__generated__/NotificationItem_notification.graphql'

const frag = graphql`
  fragment NotificationItem_notification on Notification {
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

type Props = {
  notificationRef: NotificationItem_notification$key
}

export function NotificationItem(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()
  const data = useFragment<NotificationItem_notification$key>(frag, props.notificationRef)

  const nav = useNavigation<MainStackNavProp<'Notifications'>>()
  const [markAsSeen] = useMarkNotificationAsSeenMutation()

  const onPressed = useCallback(async () => {
    // TODO: [notification-link] reutilizar logica
    switch (data.link.entity) {
      case 'INCIDENT':
        nav.navigate('IncidentDetail', { incidentId: data.link.entityId })
        break
      default:
        console.warn(`Link to entity ${data.link.entity} is not implemented yet`)
        break
    }

    if (!data.seenByTargetUser) await markAsSeen({ notificationId: data.notificationId })
  }, [data, nav, markAsSeen])

  const isMessage = false

  return (
    <>
      <TouchableOpacity
        style={data.seenByTargetUser ? s.containerRead : s.container}
        onPress={onPressed}
      >
        <View>
          <View style={s.header}>
            {isMessage ? (
              <Icon
                name="Mail"
                size="xs"
                color={data.seenByTargetUser ? colors.textLighter : colors.primary}
                style={s.icon}
              />
            ) : (
              !data.seenByTargetUser && (
                <View style={s.dotIcon}>
                  <Dot color={colors.primary} />
                </View>
              )
            )}

            <Text variant="body">{data.title}</Text>
            <View style={s.date}>
              <Text size="s" color="textLight">
                {t('formatters.relativeTimeToNow', { time: new Date(data.createdAt) }) as string}
              </Text>
            </View>
          </View>
          <Text color="textLight" numberOfLines={2}>
            {`${data.body}: "${data.subtitle}"`}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider style={s.divider} />
    </>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  containerRead: {
    backgroundColor: colors.backgroundDarker,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  container: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.m,
  },
  icon: {
    paddingRight: spacing.m,
  },
  dotIcon: {
    paddingRight: spacing.l,
  },
  date: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    flexGrow: 0,
  },
}))
