import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '~/components/v1/atoms'
import { useSession } from '~/hooks/use-session'
import type { HomeTabNavProp } from '~/navigation/types'

export function Profile() {
  const insets = useSafeAreaInsets()
  const { closeSession } = useSession()
  const nav = useNavigation<HomeTabNavProp<'Profile'>>()

  const onNotificationsPressed = () => {
    nav.navigate('Notifications')
  }

  return (
    <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
      <Text variant="header">{t('profile.title') as string}</Text>
      <Button title={'Notifications'} onPress={onNotificationsPressed} />
      <Button title={t('auth.logout')} onPress={closeSession} />
    </ScrollView>
  )
}
