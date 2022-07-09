import { useMemo } from 'react'
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import type { Theme } from './theme'
import { useTheme } from './contexts/Theme'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

type Creator<T> = (theme: Theme) => T

export function makeUseStyles<T extends NamedStyles<T>>(stylesOrCreator: T | Creator<T>) {
  const creator: Creator<T> =
    typeof stylesOrCreator === 'function' ? stylesOrCreator : (_: Theme) => stylesOrCreator

  const useStyles = () => {
    const theme = useTheme()
    return useMemo(() => StyleSheet.create(creator(theme)), [theme])
  }

  return useStyles
}
