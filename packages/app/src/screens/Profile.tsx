import { t } from '@metis/shared'
import React from 'react'
import { Button } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Box from '~/components/v0-legacy/atoms/Box'
import Text from '~/components/v0-legacy/atoms/Text'
import { useSession } from '~/hooks/use-session'

export function Profile() {
  const insets = useSafeAreaInsets()
  const { closeSession } = useSession()

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        <Text variant="header" m="md">
          {t('profile.title')}
        </Text>
        <Button title={t('auth.logout')} onPress={closeSession} />
      </ScrollView>
    </Box>
  )
}
