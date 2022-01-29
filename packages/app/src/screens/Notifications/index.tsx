import { t } from '@metis/shared'
import React, { useState } from 'react'
import {
  ActionSheetIOS,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { Loading, Text } from '~/components/v1/atoms'
import { CustomHeader } from '~/components/v1/molecules'
import { __IOS__ } from '~/config'
import { NOTIFICATIONS_PAGE_SIZE } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { NotificationsQuery as NotificationsQueryType } from '~/__generated__/NotificationsQuery.graphql'
import { NotificationList } from './NotificationList'

const query = graphql`
  query NotificationsQuery($count: Int!, $cursor: String) {
    ...NotificationList_query @arguments(count: $count, cursor: $cursor)
  }
`

export function Notifications() {
  const s = useStyles()
  const insets = useSafeAreaInsets()

  const data = useLazyLoadQuery<NotificationsQueryType>(
    query,
    {
      count: NOTIFICATIONS_PAGE_SIZE,
      cursor: null,
    },
    { fetchPolicy: 'network-only' },
  )

  // const [markAllAsRead, isSending] = useMarkAllNotificationsAsSeenMutation() // TODO
  const [showMore, setShowMore] = useState(false)

  const onPressMore = () => {
    if (__IOS__) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('Mark all as read'), t('Cancel')],
          cancelButtonIndex: 1,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // await markAllAsRead() // TODO
          }
        },
      )
    } else {
      setShowMore(true)
    }
  }

  return (
    <>
      <View style={[s.container, { marginBottom: insets.bottom }]}>
        <CustomHeader
          title={t('notification.header')}
          rightIcon="More"
          onPressRight={onPressMore}
          // isLoading={isSending} // TODO
        />
        {data ? <NotificationList queryRef={data} /> : <Loading />}
      </View>
      {/* TODO: trocar por ActionSheet component ? */}
      <TouchableOpacity>
        {!__IOS__ && data && (
          <Modal visible={showMore} animationType="fade" transparent={true}>
            <TouchableWithoutFeedback onPressOut={() => setShowMore(false)}>
              <View style={s.androidModalContainer}>
                <TouchableOpacity
                  style={s.modalButtonContainer}
                  onPress={async () => {
                    // await markAllAsRead() // TODO
                    setShowMore(false)
                  }}
                >
                  <Text style={s.modalText} color="pureBlack" size="l">
                    {t('Mark all as read') as string}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </TouchableOpacity>
    </>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  androidModalContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalButtonContainer: {
    paddingLeft: spacing.xl,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.pureWhite,
  },
  modalText: {
    paddingVertical: spacing.xl,
  },
}))
