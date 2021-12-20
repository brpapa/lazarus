import React from 'react'
import { Box } from '~/components/atomics'
import Loading from '~/components/Loading'

export default function SplashScreen() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Loading />
    </Box>
  )
}
