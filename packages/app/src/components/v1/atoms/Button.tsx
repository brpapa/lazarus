import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { Color, makeUseStyles } from '~/theme/v1'

import { ActivityIndicator } from './ActivityIndicator'
import { Text } from './Text'

type Props = TouchableOpacityProps & {
  content: string
  large?: boolean
  loading?: boolean
  textColor?: Color
}

export function Button(props: Props) {
  const s = useStyles()

  const {
    content,
    large = false,
    loading = false,
    textColor = 'pureWhite',
    disabled,
    style,
    ...otherProps
  } = props

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[
        s.container,
        (loading || disabled) && s.opacityReduced,
        large && s.largeButton,
        style,
      ]}
      {...otherProps}
    >
      {loading && <ActivityIndicator color="pureWhite" style={s.spacingRight} />}
      <Text variant="semiBold" color={textColor}>
        {content}
      </Text>
    </TouchableOpacity>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    backgroundColor: colors.primary,
    height: 36,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  spacingRight: {
    paddingRight: spacing.xl,
  },
  opacityReduced: {
    opacity: 0.75,
  },
  largeButton: {
    height: 44,
    paddingHorizontal: 0,
  },
}))
