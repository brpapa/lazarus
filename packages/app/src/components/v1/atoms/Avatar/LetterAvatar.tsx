import React from 'react'
import { View } from 'react-native'
import { makeUseStyles } from '~/theme/v1'
import type { AvatarProps } from '.'
import { automaticFontColor } from '~/helpers/automatic-font-color'
import { Text } from '../Text'

type Props = Pick<AvatarProps, 'style'> & {
  size: number
  fontSize: number
  label: string
  color: string
}

export function LetterAvatar(props: Props) {
  const styles = useStyles()

  const { size, fontSize, style, color, label } = props

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize, color: automaticFontColor(color) }]}>{label}</Text>
    </View>
  )
}

const useStyles = makeUseStyles(() => ({
  container: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textTransform: 'capitalize',
  },
}))
