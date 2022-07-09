import { createTamagui } from '@tamagui/core'
import { shorthands } from './src/theme/v2-beta-tamagui/shorthands'
import { tokens } from './src/theme/v2-beta-tamagui/tokens'
import { themes } from './src/theme/v2-beta-tamagui/themes'

const config = createTamagui({
  defaultTheme: 'light',
  tokens,
  shorthands,
  themes,
  // define reusable responsive media queries
  media: {
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    gtMd: { minWidth: 980 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

// this should export config as default because is a requirement of @tamagui/babel-plugin
export default config
