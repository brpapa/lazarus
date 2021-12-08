import { createTheme } from '@tamagui/core'
import { tokens } from './tokens'

const lightColorsVar = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark')),
)
const darkColorsVar = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v]),
)

// bg, color and borderColors are the primary/clearest colors
const lightTheme = createTheme({
  bg: '#fff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  colorBright: '#000',
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA6,
  shadowColor2: tokens.color.grayA8,
  ...lightColorsVar,
})

export type BaseTheme = typeof lightTheme

const darkTheme = createTheme<BaseTheme>({
  bg: '#171717',
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray4Dark,
  bg4: tokens.color.gray5Dark,
  bgTransparent: tokens.color.grayA1Dark,
  color: '#ddd',
  colorBright: '#fff',
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray6Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  shadowColor: tokens.color.grayA7,
  shadowColor2: tokens.color.grayA9,
  ...darkColorsVar,
})

// const lightTranslucentTheme = createTheme<BaseTheme>({
//   ...lightTheme,
//   bg: 'rgba(255,255,255,0.85)',
//   bg2: 'rgba(250,250,250,0.85)',
//   bg3: 'rgba(240,240,240,0.85)',
//   bg4: 'rgba(240,240,240,0.7)',
// })

// const darkTranslucentTheme = createTheme<BaseTheme>({
//   ...darkTheme,
//   bg: 'rgba(0,0,0,0.7)',
//   bg2: 'rgba(0,0,0,0.5)',
//   bg3: 'rgba(0,0,0,0.25)',
//   bg4: 'rgba(0,0,0,0.1)',
// })

// const coloredThemes = colorNames.reduce<Record<typeof colorNames[number], BaseTheme>>(
//   (acc, key) => {
//     for (const scheme of ['light', 'dark'] as const) {
//       const isDark = scheme === 'dark'
//       const colorKey = isDark ? `${key}Dark` : key
//       const colorValues = Colors[colorKey] as any
//       const offset = isDark ? -1 : 0

//       acc[`${key}-${scheme}`] = {
//         color: isDark ? '#ddd' : colorValues[`${key}12`],
//         color2: isDark ? darkTheme.color2 : lightTheme.color2,
//         color3: colorValues[`${key}11`],
//         color4: colorValues[`${key}10`],
//         bg: colorValues[`${key}${2 + offset}`],
//         bg2: colorValues[`${key}${3 + offset}`],
//         bg3: colorValues[`${key}${4 + offset}`],
//         bg4: colorValues[`${key}${5 + offset}`],
//         bgTransparent: colorValues[`${key}${1 + offset}`],
//         borderColor: colorValues[`${key}${4 + offset}`],
//         borderColor2: colorValues[`${key}${5 + offset}`],
//       }
//     }
//     return acc
//   },
//   {} as any,
// )

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  // lightTranslucent: lightTranslucentTheme,
  // darkTranslucent: darkTranslucentTheme,
  // nested themes: *-light, *-dark
  // ...coloredThemes,
} as const

export type Themes = typeof themes


// OLD DESIGN SYSTEM

// color: {
//     white: '#fff',
//     black: '#000',
//     'red-lighter': '#F7D4D6',
//     'red-light': '#FF1A1A',
//     'red-default': '#E00',
//     'red-dark': '#C50000',
//     'blue-lighter': '#D3E5FF',
//     'blue-light': '#3291FF',
//     'blue-default': '#0070F3',
//     'blue-dark': '#0761D1',
//     'yellow-lighter': '#FFEFCF',
//     'yellow-light': '#F7B955',
//     'yellow-default': '#F5A623',
//     'yellow-dark': '#AB570A',
//     'violet-lighter': '#E3D7FC',
//     'violet-light': '#8A63D2',
//     'violet-default': '#7928CA',
//     'violet-dark': '#4C2889',
//     'cyan-lighter': '#AAFFEC',
//     'cyan-light': '#79FFE1',
//     'cyan-default': '#50E3C2',
//     'cyan-dark': '#29BC9B',
//     'highlight-purple': '#F81CE5',
//     'highlight-magenta': '#EB367F',
//     'highlight-pink': '#FF0080',
//     'highlight-yellow': '#FFF500',
//   },

// export const customTheme = extendTheme({
//   colors: {
//     background: '#FFF',
//     'accents-1': '#FAFAFA',
//     'accents-2': '#EAEAEA',
//     'accents-3': '#999',
//     'accents-4': '#888',
//     'accents-5': '#666',
//     'accents-6': '#444',
//     'accents-7': '#333',
//     'accents-8': '#111',
//     foreground: '#000',
//     'error-lighter': palette.red.lighter,
//     'error-light': palette.red.light,
//     error: palette.red.default,
//     'error-dark': palette.red.dark,
//     'success-lighter': palette.blue.lighter,
//     'success-light': palette.blue.light,
//     success: palette.blue.default,
//     'success-dark': palette.blue.dark,
//     'warning-lighter': palette.yellow.lighter,
//     'warning-light': palette.yellow.light,
//     warning: palette.yellow.default,
//     'warning-dark': palette.yellow.dark,
//     'incident-selected': palette.blue.default,
//   },
//   spacing: {
//     xs: 2,
//     sm: 8,
//     md: 16,
//     lg: 24,
//     xl: 40,
//   },
//   // minimum widths (inclusive) for different target screen sizes
//   breakpoints: {
//     phone: 0,
//     longPhone: {
//       width: 0,
//       height: 812,
//     },
//     tablet: 768,
//     largeTablet: 1024,
//   },
//   textVariants: {
//     header: {
//       fontFamily: 'Helvetica Neue',
//       fontWeight: 'bold',
//       fontSize: 30,
//       lineHeight: 40.5,
//       color: 'foreground',
//     },
//     subheader: {
//       fontFamily: 'Helvetica Neue',
//       fontWeight: '600',
//       fontSize: 20,
//       lineHeight: 20,
//       color: 'accents-5',
//     },
//     title: {
//       fontFamily: 'Helvetica Neue',
//       fontWeight: '400',
//       fontSize: 20,
//       lineHeight: 20,
//       color: 'accents-8',
//     },
//     body: {
//       fontFamily: 'Helvetica Neue',
//       fontSize: 16,
//       lineHeight: 24,
//       color: 'foreground',
//     },
//     body2: {
//       fontFamily: 'Helvetica Neue',
//       fontSize: 14,
//       lineHeight: 20,
//       color: 'accents-6',
//     },
//     link: {
//       color: 'success',
//       fontWeight: 'bold',
//     },
//   }
// } as const)

// export const darkTheme: Theme = {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     background: '#000',
//     'accents-1': '#111',
//     'accents-2': '#333',
//     'accents-3': '#666',
//     'accents-4': '#444',
//     'accents-5': '#888',
//     'accents-6': '#999',
//     'accents-7': '#EAEAEA',
//     'accents-8': '#FAFAFA',
//     foreground: '#FFF',
//   },
// }
