import React, { ReactChild } from 'react'
import { Text as BaseText, TextProps as BaseTextProps } from 'react-native'
import { Color, FontSize, FontVariant, useTheme } from '~/theme/v1'

type TextProps = BaseTextProps & {
  variant?: FontVariant
  size?: FontSize
  color?: Color
  children?: ReactChild | ReactChild[]
}

export function Text(props: TextProps) {
  const { colors, fontSizes, fontVariants } = useTheme()

  const { variant = 'body', size, color, style, ...restProps } = props

  const fontStyles = fontVariants[variant]
  const fontSizeStyle = size && { fontSize: fontSizes[size] }
  const fontColorStyle = color && { color: colors[color] }

  const styles = [fontStyles, fontSizeStyle, fontColorStyle, style].filter((s) => s !== undefined)

  return <BaseText style={styles} {...restProps} />
}
