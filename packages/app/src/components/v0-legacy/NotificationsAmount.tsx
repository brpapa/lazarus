import { useTheme } from '@shopify/restyle'
import React from 'react'
import { BellIcon } from '~/icons_LEGACY'
import { Box, Text } from '~/components/v0-legacy/atoms'
import { t } from '@metis/shared'
import type { Theme } from '~/shared/theme/v0-legacy'

type NotificationAmountProps = Omit<React.ComponentPropsWithoutRef<typeof Box>, 'children'> & {
  amount: number
}

export default function NotificationAmount(props: NotificationAmountProps) {
  const theme = useTheme<Theme>()

  return (
    <Box flex={1} flexDirection="row" alignItems="center" {...props}>
      <BellIcon width={20} height={20} color={theme.colors['foreground']} />
      <Text variant="body" m="sm">
        {t('incident.amountOfPeopleNotified', { count: props.amount })}
      </Text>
    </Box>
  )
}
