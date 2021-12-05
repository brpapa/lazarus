import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import Box from '~/components/atomics/Box'
import intl from '~/shared/intl'
import Text from '~/components/atomics/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        <Text variant="header" m="md">
          {intl.myProfile}
        </Text>
      </ScrollView>
    </Box>
  )
}
