import { createBox, useTheme } from '@shopify/restyle'
import React from 'react'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import Text from '~/components/atomics/Text'
import type { Theme } from '~/shared/theme'

const BaseButton = createBox<Theme, TouchableOpacityProps & { children?: React.ReactNode }>(
  TouchableOpacity,
)

const BUTTON_SIZE = 40

type ButtonProps = Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'children'> & {
  label?: string
  icon?: (props: SvgProps) => JSX.Element
  isLoading?: boolean
}

export default function MyButton({ label, icon, isLoading, ...props }: ButtonProps) {
  const theme = useTheme<Theme>()

  return (
    <BaseButton
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      bg="accents-2"
      borderRadius={999}
      p="xs"
      // width="auto"
      width={BUTTON_SIZE} // to be circle
      height={BUTTON_SIZE}
      {...props}
    >
      {icon && icon({ color: theme.colors.foreground })}
      {label && (
        <Text variant="body" ml={icon && 'sm'} mr={isLoading ? 'sm' : undefined}>
          {label}
        </Text>
      )}
      {isLoading && <ActivityIndicator color={theme.colors.foreground} />}
    </BaseButton>
  )
}
