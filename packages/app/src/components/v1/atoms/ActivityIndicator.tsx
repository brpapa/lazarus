import React from 'react'
import { ActivityIndicator as BaseActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { Color, useTheme } from '~/theme/v1'

type Props = ActivityIndicatorProps & {
  color?: Color
}

export function ActivityIndicator(props: Props) {
  const { colors } = useTheme()

  const { color = 'primary', ...otherProps } = props
  const indicatorColor = colors[color]

  return <BaseActivityIndicator color={indicatorColor} {...otherProps} />
}
