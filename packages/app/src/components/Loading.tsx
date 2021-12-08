import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from '@tamagui/core'
import { YStack } from './atomics/Stacks'

export default function Loading() {
  const theme = useTheme()

  return (
    <YStack als="center" space>
      <ActivityIndicator color={theme.color.toString()} />
    </YStack>
  )
}
