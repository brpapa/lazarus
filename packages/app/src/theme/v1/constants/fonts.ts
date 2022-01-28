import type { TextStyle } from 'react-native'
import { colorTheme } from './colors'

export const fontVariants = (isDarkMode: boolean) => {
  const colors = colorTheme(isDarkMode)
  return {
    header: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.bold,
      fontSize: 30,
      lineHeight: 40.5,
      color: colors.foreground,
    } as TextStyle,
    subheader: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.semibold,
      fontSize: 20,
      lineHeight: 20,
      color: colors.accent5,
    } as TextStyle,
    title: {
      fontFamily: fontFamilies.body,
      fontWeight: fontWeights.bold,
      fontSize: 20,
      lineHeight: 30,
      color: colors.accent8,
    } as TextStyle,
    body: {
      fontFamily: fontFamilies.body,
      fontSize: 16,
      color: colors.foreground,
    } as TextStyle,
    body2: {
      fontFamily: fontFamilies.body,
      fontSize: 14,
      color: colors.accent6,
    } as TextStyle,
    link: {
      fontFamily: fontFamilies.body,
      color: colors.success,
      fontWeight: 'bold',
    } as TextStyle,
  }
}

export const fontSizes = {
  xl: 24,
  l: 18,
  m: 16,
  s: 14,
  xs: 12,
}

export const headingFontSizes = {
  h1: 32,
  h2: 24,
  h3: 22,
  h4: 20,
  h5: 18,
  h6: 17,
}

export const letterSpacings = {
  xxs: -1.5,
  xs: -0.5,
  sm: 0,
  md: 0.1,
  lg: 0.15,
  xl: 0.25,
  '2xl': 0.4,
  '3xl': 0.5,
  '4xl': 1.25,
  '5xl': 1.5,
}

export const fontFamilies = {
  heading: 'Helvetica',
  body: 'Helvetica',
  // body: 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: 'Monospace',
}

export const lineHeights = {
  none: 1,
  shorter: 1.25,
  short: 1.375,
  base: 1.5,
  tall: 1.625,
  taller: 2,
}

export const fontWeights = {
  hairline: '100',
  thin: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
}
