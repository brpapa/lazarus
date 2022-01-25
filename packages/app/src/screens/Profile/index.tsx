import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { graphql, useFragment } from 'react-relay'
import { Avatar, Button, Divider, Text } from '~/components/v1/atoms'
import { ImageModal as ImageModal } from '~/components/v1/molecules'
import { useSession } from '~/hooks/use-session'
import type { HomeTabNavProp } from '~/navigation/types'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { Profile_query$key } from '~/__generated__/Profile_query.graphql'
import { MenuItem } from './MenuItem'

// TODO
const NAME = 'Bruno Papa'
const EMAIL = 'bruno.papa@hotmail.com'
const USER_AVATAR = 'https://metis-public-static-content.s3.amazonaws.com/91cacff3-c5f3-4b7e-93c7-37098dee928e.jpg'

const frag = graphql`
  fragment Profile_query on Query {
    me {
      userId
      # name
      # avatarUrl
    }
  }
`

type Props = {
  queryRef: Profile_query$key
  haveNotSeenNotifications: boolean
}

export function Profile(props: Props) {
  const { data } = useFragment<Profile_query$key>(frag, props.queryRef)

  const s = useStyles()
  const { colors } = useTheme()
  const { closeSession } = useSession()
  const nav = useNavigation<HomeTabNavProp<'Profile'>>()
  const [showImageModal, setShowImageModal] = useState(false)

  const onAvatarPressed = () => {
    if (USER_AVATAR) setShowImageModal(true)
  }

  const onImageModalCancelPressed = () => {
    if (!showImageModal) setShowImageModal(true)
    setTimeout(() => setShowImageModal(false), 50)
  }

  const onLogOutPressed = () => {
    Alert.alert(`${t('logout')}?`, t('logout.confirmMessage'), [
      { text: t('cancel') },
      {
        text: t('logout'),
        onPress: closeSession,
      },
    ])
  }

  return (
    <>
      <SafeAreaView style={s.container}>
        <View style={s.statusBar} />
        <ScrollView>
          <View style={s.headerContainer}>
            <Avatar src={USER_AVATAR} size="l" label={NAME[0]} onPress={onAvatarPressed} />
            <View style={s.usernameText}>
              <Text variant="title" size="l">
                {NAME}
              </Text>
            </View>
            <View style={s.email}>
              <Text variant="body" size="m" color="textLight">
                {EMAIL}
              </Text>
            </View>
            <Button
              content={t('Edit Profile')}
              style={s.button}
              disabled={false}
              // onPress={() => nav.navigate('EditProfile', { user })}
            />
          </View>
          <View style={s.bodyContainer}>
            <View style={s.menuContainer}>
              <MenuItem
                title={t('Notifications')}
                iconName="Notifications"
                indicator={props.haveNotSeenNotifications}
                onPress={() => nav.navigate('Notifications')}
              />
              <Divider style={s.dividerList} />
              <MenuItem
                title={t('Messages')}
                iconName="Mail"
                // onPress={() => nav.navigate('Messages')}
              />
              <Divider style={s.dividerList} />
              <MenuItem
                title={t('Activity')}
                iconName="Chart"
                // onPress={() => nav.navigate('Activity')}
              />
            </View>
            <View style={s.menuContainer}>
              <MenuItem
                title={t('Password & Security')}
                iconName="Lock"
                // onPress={() => nav.navigate('ChangePassword')}
              />
              <Divider style={s.dividerList} />
              <MenuItem
                title={t('Preferences')}
                iconName="Settings"
                // onPress={() => nav.navigate('Preferences')}
              />
            </View>
            <View style={s.menuContainer}>
              <MenuItem
                title={t('logout')}
                iconName="Power"
                iconColor={colors.error}
                onPress={onLogOutPressed}
              />
            </View>
            {showImageModal && (
              <ImageModal
                visible={showImageModal}
                uri={USER_AVATAR}
                onPressCancel={onImageModalCancelPressed}
              />
            )}
          </View>
        </ScrollView>
        <View style={s.bounceContainer}>
          <View style={s.topBounce} />
          <View style={s.bottomBounce} />
        </View>
      </SafeAreaView>
    </>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
  },
  statusBar: {
    paddingTop: spacing.m, // Constants.statusBarHeight,
    paddingBottom: spacing.m,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
  email: {
    paddingBottom: spacing.s,
  },
  bioContainer: {
    paddingHorizontal: spacing.xxl,
  },
  button: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  bodyContainer: {
    backgroundColor: colors.backgroundDarker,
  },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
  dividerList: {
    flexGrow: 0,
    marginLeft: 64,
    marginRight: spacing.xxl,
  },
  bounceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  topBounce: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomBounce: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
}))
