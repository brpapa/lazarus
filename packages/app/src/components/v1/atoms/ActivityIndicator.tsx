import React from 'react'
import { ActivityIndicator as BaseActivityIndicator, ActivityIndicatorProps } from 'react-native'

type Props = ActivityIndicatorProps

export function ActivityIndicator(props: Props) {
  return <BaseActivityIndicator {...props} />
}
