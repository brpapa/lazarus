import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type ShutterProps = {
  onClick: () => any
  style: StyleProp<ViewStyle>
}

const Shutter = (props: ShutterProps) => {
  const pressed = useSharedValue(false)

  const handleStateChange = (event: TapGestureHandlerGestureEvent) => {
    switch (event.nativeEvent.state) {
      case State.BEGAN:
        pressed.value = true
        break
      case State.END:
        pressed.value = false
        props.onClick()
        break
      default:
        break
    }
  }

  const uas = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value ? 'pink' : 'red',
      transform: [{ scale: pressed.value ? 1.1 : 1 }],
    }
  })

  return (
    <TapGestureHandler onHandlerStateChange={handleStateChange}>
      <Animated.View style={[styles.shutter, uas]} />
    </TapGestureHandler>
  )
}

const styles = StyleSheet.create({
  shutter: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
})

export default Shutter
