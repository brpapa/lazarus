import React from 'react'

import type { IconName } from '~/icons'
import { IconSize, makeUseStyles, useTheme } from '~/theme/v1'

import { Icon, IconProps } from './Icon'

type Props = Pick<IconProps, 'color' | 'style'> & {
  size?: number
  backgroundColor?: string
  icon?: IconName
  iconSize?: IconSize
  onPress: () => void
}

export function FloatingButton(props: Props) {
  const styles = useStyles()
  const { colors } = useTheme()

  const {
    size = 56,
    backgroundColor = colors.primary,
    icon = 'Add',
    iconSize = 'xl',
    color = colors.pureWhite,
    onPress,
    style,
  } = props

  return (
    <Icon
      name={icon}
      color={color}
      size={iconSize}
      onPress={onPress}
      style={[styles.container, { width: size, height: size, backgroundColor }, style]}
    />
  )
}

const useStyles = makeUseStyles(({ shadow }) => ({
  container: {
    ...shadow,
    shadowOpacity: 0.36,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
