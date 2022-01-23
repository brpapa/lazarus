import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { FIXED_COLOR_SCHEME } from '~/config'
import { ColorScheme, filterColorScheme, getSystemColorScheme } from '../helpers/color-scheme'

type ContextValue = {
  colorScheme: ColorScheme
  setColorScheme: (colorScheme: ColorScheme) => void
}

const Context = createContext<ContextValue | undefined>(undefined)

type Props = {
  children: ReactElement
}

export function ColorSchemeProvider({ children }: Props) {
  // TODO: use Recoil for this?
  const fixedColorScheme = filterColorScheme(FIXED_COLOR_SCHEME)

  const [colorScheme, setColorSchemeState] = useState(
    () => fixedColorScheme || getSystemColorScheme(),
  )

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    if (colorScheme === 'no-preference') {
      setColorSchemeState(getSystemColorScheme())
    } else {
      setColorSchemeState(colorScheme)
    }
  }, [])

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useColorScheme() {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useColorScheme must be inside an AppearanceProvider')
  }

  return context
}
