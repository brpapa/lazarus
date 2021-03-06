import React, { useState } from 'react'
import { ImageBackground, ImageBackgroundProps, TouchableOpacity } from 'react-native'
import { makeUseStyles, useTheme } from '~/theme/v1'
import {
  AVATAR_ICON_SIZES,
  AVATAR_ICON_SIZE_VARIANTS,
  AVATAR_LETTER_SIZES,
} from '~/theme/v1/constants'
import { LetterAvatar } from './LetterAvatar'

type Props = Omit<ImageBackgroundProps, 'source'> & {
  src?: string
  size?: AVATAR_ICON_SIZE_VARIANTS
  label?: string
  color?: string
  defaultImage?: boolean
  onPress?: () => void
}

export type { Props as AvatarProps }

export function Avatar(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()

  const {
    src,
    size = 's',
    color = colors.textLighter,
    style,
    label = '',
    onPress,
    ...otherProps
  } = props

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const finalSize = AVATAR_ICON_SIZES[size]
  const fontSize = AVATAR_LETTER_SIZES[size]

  const loadChild = src === undefined || error
  const imgSource = { uri: src ?? undefined }

  const letterAvatar = (
    <LetterAvatar size={finalSize} color={color} label={label} style={style} fontSize={fontSize} />
  )

  return (
    <TouchableOpacity onPress={onPress}>
      {src === undefined && loading ? (
        letterAvatar
      ) : (
        <ImageBackground
          source={imgSource}
          style={[{ width: finalSize, height: finalSize }, style]}
          imageStyle={s.circle}
          onError={() => setError(true)}
          // TODO: Decide what to display onLoading
          onLoadEnd={() => setLoading(false)}
          {...otherProps}
        >
          {loadChild && letterAvatar}
        </ImageBackground>
      )}
    </TouchableOpacity>
  )
}

const useStyles = makeUseStyles(() => ({
  circle: {
    borderRadius: 100,
  },
}))
