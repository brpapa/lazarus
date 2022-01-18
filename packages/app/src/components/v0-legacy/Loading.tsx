import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from '@shopify/restyle'
import type { Theme } from '~/shared/theme/v0-legacy'
import Box from '~/components/v0-legacy/atoms/Box'

export default function Loading() {
  const theme = useTheme<Theme>()

  return (
    <Box flex={1} alignItems="center" justifyContent="center" overflow={'hidden'}>
      <ActivityIndicator color={theme.colors.foreground} />
    </Box>
  )
}
