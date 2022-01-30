import React, { createContext, ReactElement, useContext, useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { __IOS__ } from '~/shared/constants'
import { getTheme, Theme } from '../theme'
import { useColorScheme } from './ColorScheme'

const Context = createContext<Theme | undefined>(undefined)

type Props = {
  children: ReactElement
}

export function ThemeProvider({ children }: Props) {
  const { colorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()

  const theme = useMemo(
    () =>
      getTheme({
        colorScheme,
        insets,
        aesthetic: __IOS__ ? 'ios' : 'android',
      }),
    [colorScheme, insets],
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
