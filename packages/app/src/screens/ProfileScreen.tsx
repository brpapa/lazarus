import React from 'react'
import { Button } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import { useSession } from '~/hooks/use-session'
import intl from '~/shared/intl'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const { closeSession: signOut } = useSession()

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        <Text variant="header" m="md">
          {intl.myProfile}
        </Text>
        <Button title="Sair" onPress={signOut} />
      </ScrollView>
    </Box>
  )
}
