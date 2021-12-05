import React from 'react'

import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import intl from '~/shared/intl'

type RelativeInfoProps = Omit<React.ComponentPropsWithoutRef<typeof Box>, 'children'>

export default function RelativeInfo(props: RelativeInfoProps) {
  return (
    <Box flex={1} flexDirection="row" {...props}>
      <Text variant="body2">{intl.relativeUpdatedTimeToNow.format()}</Text>
      <Text mx="sm" variant="body2">
        {'·'}
      </Text>
      <Text variant="body2">{intl.relativeDistanceToCurrentLocation.format()}</Text>
    </Box>
  )
}
