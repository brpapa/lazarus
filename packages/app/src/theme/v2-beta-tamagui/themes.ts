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
