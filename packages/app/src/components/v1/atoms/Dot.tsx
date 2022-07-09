import React from 'react'
import { View, ViewProps } from 'react-native'

import { makeUseStyles, useTheme } from '~/theme/v1'

const dotVariant = {
  large: {
    size: 10,
    padding: 3,
  },
  normal: {
    size: 9,
    padding: 1.5,
  },
  small: {
    size: 6,
    padding: 1,
  },
}

type Props = ViewProps & {
  color?: string
  variant?: keyof typeof dotVariant
}

export function Dot(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()

  const { variant = 'normal', color = colors.primary, style, ...otherProps } = props

  return (
    <View style={{ padding: dotVariant[variant].padding }}>
      <View
        style={[
          s.circle,
          {
            backgroundColor: color,
            width: dotVariant[variant].size,
            height: dotVariant[variant].size,
          },
          style,
        ]}
        {...otherProps}
      />
    </View>
  )
}

const useStyles = makeUseStyles(() => ({
  circle: {
    borderRadius: 100,
  },
}))
