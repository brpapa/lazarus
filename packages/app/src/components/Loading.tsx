import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from '@shopify/restyle'
import type { Theme } from '~/shared/theme'
import Box from '~/components/atomics/Box'

export default function Loading() {
  const theme = useTheme<Theme>()

  return (
    <Box flex={1} alignItems="center" justifyContent="center" overflow={'hidden'}>
      <ActivityIndicator color={theme.colors.foreground} />
    </Box>
  )
}
