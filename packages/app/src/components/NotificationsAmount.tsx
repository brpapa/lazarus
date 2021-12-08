import React from 'react'

import intl from '~/shared/intl'
import { BellIcon } from '~/assets/icons'
import { Text, useTheme } from '@tamagui/core'
import { XStack } from './atomics/Stacks'
import { Paragraph } from './atomics/Paragraph'

type NotificationAmountProps = Omit<React.ComponentPropsWithoutRef<typeof Box>, 'children'> & {
  amount: number
}

export default function NotificationAmount(props: NotificationAmountProps) {
  const theme = useTheme()

  return (
    <XStack flex={1} flexDirection="row" alignItems="center" {...props}>
      <BellIcon width={20} height={20} color={theme.color.toString()} />
      <Paragraph m="$2">{intl.amountOfPeopleNotified.format({ amount: props.amount })}</Paragraph>
    </XStack>
  )
}
