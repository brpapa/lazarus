import React from 'react'
import { View } from 'react-native'
import { makeUseStyles } from '~/theme/v1'

type SpashProps = {}

export function Spash(_props: SpashProps) {
  const s = useStyles()

  return <View style={s.container}></View>
}

const useStyles = makeUseStyles(() => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
