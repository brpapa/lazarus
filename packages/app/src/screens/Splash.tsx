import React from 'react'
import { Box } from '~/components/v0-legacy/atoms'
import Loading from '~/components/v0-legacy/Loading'

export function Splash() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Loading />
    </Box>
  )
}
