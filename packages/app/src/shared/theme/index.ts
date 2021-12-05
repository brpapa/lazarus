import { createTheme } from '@shopify/restyle'
import palette from './palette'

export const theme = createTheme({
  name: 'light' as ThemeName,
  colors: {
    background: '#FFF',
    'accents-1': '#FAFAFA',
    'accents-2': '#EAEAEA',
    'accents-3': '#999',
    'accents-4': '#888',
    'accents-5': '#666',
    'accents-6': '#444',
    'accents-7': '#333',
    'accents-8': '#111',
    foreground: '#000',
    'error-lighter': palette.red.lighter,
    'error-light': palette.red.light,
    error: palette.red.default,
    'error-dark': palette.red.dark,
    'success-lighter': palette.blue.lighter,
    'success-light': palette.blue.light,
    success: palette.blue.default,
    'success-dark': palette.blue.dark,
    'warning-lighter': palette.yellow.lighter,
    'warning-light': palette.yellow.light,
    warning: palette.yellow.default,
    'warning-dark': palette.yellow.dark,
    'incident-selected': palette.blue.default,
  },
  spacing: {
    xs: 2,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  // minimum widths (inclusive) for different target screen sizes
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
  textVariants: {
    header: {
      fontFamily: 'Helvetica Neue',
      fontWeight: 'bold',
      fontSize: 30,
      lineHeight: 40.5,
      color: 'foreground',
    },
    subheader: {
      fontFamily: 'Helvetica Neue',
      fontWeight: '600',
      fontSize: 20,
      lineHeight: 20,
      color: 'accents-5',
    },
    title: {
      fontFamily: 'Helvetica Neue',
      fontWeight: '400',
      fontSize: 20,
      lineHeight: 20,
      color: 'accents-8',
    },
    body: {
      fontFamily: 'Helvetica Neue',
      fontSize: 16,
      lineHeight: 24,
      color: 'foreground',
    },
    body2: {
      fontFamily: 'Helvetica Neue',
      fontSize: 14,
      lineHeight: 20,
      color: 'accents-6',
    },
    link: {
      color: 'success',
      fontWeight: 'bold',
    },
  },
})

export type Theme = typeof theme

export const darkTheme: Theme = {
  ...theme,
  name: 'dark' as ThemeName,
  colors: {
    ...theme.colors,
    background: '#000',
    'accents-1': '#111',
    'accents-2': '#333',
    'accents-3': '#666',
    'accents-4': '#444',
    'accents-5': '#888',
    'accents-6': '#999',
    'accents-7': '#EAEAEA',
    'accents-8': '#FAFAFA',
    foreground: '#FFF',
  },
}

export default theme
