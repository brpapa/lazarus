import React from 'react'
import intl from '~/shared/intl'
import { SizableText } from './atomics/SizableText'
import { XStack } from './atomics/Stacks'

type RelativeInfoProps = Omit<React.ComponentPropsWithoutRef<typeof XStack>, 'children'>

export default function RelativeInfo(props: RelativeInfoProps) {
  return (
    <XStack flex={1} flexDirection="row" {...props}>
      <SizableText size="$3">{intl.relativeUpdatedTimeToNow.format()}</SizableText>
      <SizableText mx="sm" size="$3">
        {'·'}
      </SizableText>
      <SizableText size="$3">{intl.relativeDistanceToCurrentLocation.format()}</SizableText>
    </XStack>
  )
}
