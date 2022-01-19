import * as React from 'react'
import { Animated, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { useTheme } from '~/theme/v1'

type Props = {
  visible: boolean
  children?: string | number
  size?: number
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
}

export function Badge({ visible = true, size = 18, children: content, style, ...rest }: Props) {
  const [opacity] = React.useState(() => new Animated.Value(visible ? 1 : 0))
  const [rendered, setRendered] = React.useState(visible ? true : false)

  const theme = useTheme()

  React.useEffect(() => {
    if (!rendered) {
      return
    }

    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setRendered(false)
      }
    })

    return () => opacity.stopAnimation()
  }, [opacity, rendered, visible])

  if (visible && !rendered) {
    setRendered(true)
  }

  if (!visible && !rendered) {
    return null
  }

  // @ts-expect-error: backgroundColor definitely exists
  const { backgroundColor = theme.colors.primary, ...restStyle } =
    StyleSheet.flatten(style) || {}
  const textColor = theme.colors.darkTextNormal

  const borderRadius = size / 2
  const fontSize = Math.floor((size * 3) / 4)

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        {
          opacity,
          transform: [
            {
              scale: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
          backgroundColor,
          color: textColor,
          fontSize,
          lineHeight: size - 1,
          height: size,
          minWidth: size,
          borderRadius,
        },
        styles.container,
        restStyle,
      ]}
      {...rest}
    >
      {content}
    </Animated.Text>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
})
