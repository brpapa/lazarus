import React from 'react'
import { View } from 'react-native'
import { makeUseStyles } from '~/theme/v1'
import { ActivityIndicator } from '../atoms/ActivityIndicator'

type Props = {
  isHidden?: boolean
}

export function FooterLoadingIndicator(props: Props) {
  const s = useStyles()

  const { isHidden = false } = props

  return isHidden ? null : (
    <View style={s.container}>
      <ActivityIndicator />
    </View>
  )
}

const useStyles = makeUseStyles(({ spacing }) => ({
  container: {
    width: '100%',
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
  },
}))
