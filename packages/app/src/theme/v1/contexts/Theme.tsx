import React, { createContext, ReactElement, useContext, useMemo } from 'react'
import { __IOS__ } from '~/config'

import { useColorScheme } from './ColorScheme'
import { getTheme, Theme } from '../theme'

const Context = createContext<Theme | undefined>(undefined)

type Props = {
  children: ReactElement
}

export function ThemeProvider({ children }: Props) {
  const { colorScheme } = useColorScheme()

  const theme = useMemo(
    () =>
      getTheme({
        colorScheme,
        aesthetic: __IOS__ ? 'ios' : 'android',
      }),
    [colorScheme],
  )

  return <Context.Provider value={theme}>{children}</Context.Provider>
}

export function useTheme() {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useTheme must be inside a ThemeProvider')
  }

  return context
}
