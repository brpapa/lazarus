import React from 'react'
import { View } from 'react-native'
import { makeUseStyles } from '~/theme/v1'
import { ActivityIndicator } from './ActivityIndicator'
import { Text } from './Text'

type Props = {
  message?: string
}

export function Loading(props: Props) {
  const s = useStyles()

  return (
    <View style={s.container}>
      <ActivityIndicator size="small" />
      {props.message && <Text>{props.message}</Text>}
    </View>
  )
}

const useStyles = makeUseStyles(() => ({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}))
