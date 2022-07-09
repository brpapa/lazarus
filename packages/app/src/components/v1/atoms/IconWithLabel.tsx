import React from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import type { IconName } from '~/icons'
import { makeUseStyles, useTheme } from '~/theme/v1'

import { Icon, IconProps } from './Icon'
import { Text } from './Text'

type Props = TouchableOpacityProps &
  Pick<IconProps, 'size' | 'color'> & {
    label: string | number
    icon: IconName
    fontStyle?: StyleProp<TextStyle>
    numberOfLines?: number
  }

export type { Props as IconWithLabelProps }

export function IconWithLabel(props: Props) {
  const { colors } = useTheme()
  const s = useStyles()

  const {
    label,
    icon,
    size,
    color = colors.textNormal,
    fontStyle,
    onPress,
    numberOfLines,
    style,
    ...otherProps
  } = props

  const content = (
    <>
      <Icon name={icon} size={size} color={color} />
      <Text style={[s.text, fontStyle]} numberOfLines={numberOfLines}>
        {label}
      </Text>
    </>
  )

  return onPress ? (
    <TouchableOpacity style={[s.container, style]} onPress={onPress} {...otherProps}>
      {content}
    </TouchableOpacity>
  ) : (
    <View style={[s.container, style]}>{content}</View>
  )
}

const useStyles = makeUseStyles(({ spacing }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingLeft: spacing.m,
    flexGrow: 1,
  },
}))
