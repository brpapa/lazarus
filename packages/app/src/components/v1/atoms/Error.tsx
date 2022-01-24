import { t } from '@metis/shared'
import React from 'react'
import { View } from 'react-native'
import { Text } from './Text'
import { makeUseStyles } from '~/theme/v1'

type Props = {
  message?: string
}

export function Error(props: Props) {
  const styles = useStyles()

  const { message = t('Something unexpected happened. Please try again') } = props

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
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
