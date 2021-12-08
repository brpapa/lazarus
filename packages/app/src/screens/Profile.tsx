import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import intl from '~/shared/intl'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Box, H1 } from '~/components/atomics'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()

  return (
    <Box flex={1} flexDirection="column" bg="$bg">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        <H1>{intl.myProfile}</H1>
      </ScrollView>
    </Box>
  )
}
