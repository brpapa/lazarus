import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

type CameraMockProps = {
  onCameraReady: () => void
}

export function CameraMock(props: CameraMockProps) {
  useEffect(() => {
    setTimeout(props.onCameraReady, 300)
  }, [props.onCameraReady])

  return <View style={StyleSheet.absoluteFill}></View>
}
