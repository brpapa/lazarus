import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { IconName } from '~/icons'
import type { FloatingButtonSize } from '~/theme/v1'
import { IconSize, makeUseStyles, useTheme } from '~/theme/v1'
import { Icon } from './Icon'

type Props = {
  icon: IconName
  size?: FloatingButtonSize
  backgroundColor?: string
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export function FloatingButton(props: Props) {
  const s = useStyles()
  const { colors, floatingButtonSizes } = useTheme()

  const { size = 'm', icon, onPress, style } = props

  const iconSizeByFloatingButtonSize: Record<FloatingButtonSize, IconSize> = {
    s: 'xs',
    m: 'l',
    l: 'xl',
  }

  return (
    <Icon
      name={icon}
      color={colors.foreground}
      size={iconSizeByFloatingButtonSize[size]}
      onPress={onPress}
      style={[
        s.container,
        {
          width: floatingButtonSizes[size],
          height: floatingButtonSizes[size],
        },
        style,
      ]}
    />
  )
}

const useStyles = makeUseStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.accent2,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
