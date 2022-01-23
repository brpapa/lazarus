export const palette = {
  red: {
    lighter: '#F7D4D6',
    light: '#FF1A1A',
    default: '#E00',
    dark: '#C50000',
  },
  blue: {
    lighter: '#D3E5FF',
    light: '#3291FF',
    default: '#0070F3',
    dark: '#0761D1',
  },
  yellow: {
    lighter: '#FFEFCF',
    light: '#F7B955',
    default: '#F5A623',
    dark: '#AB570A',
  },
  violet: {
    lighter: '#E3D7FC',
    light: '#8A63D2',
    default: '#7928CA',
    dark: '#4C2889',
  },
  cyan: {
    lighter: '#AAFFEC',
    light: '#79FFE1',
    default: '#50E3C2',
    dark: '#29BC9B',
  },
  highlight: {
    purple: '#F81CE5',
    magenta: '#EB367F',
    pink: '#FF0080',
    yellow: '#FFF500',
  },
  white: '#FFF',
  black: '#000',
  //
  pureBlack: '#000000',
  black100: '#1A1A1A',
  black60: '#757575',
  black20: '#D1D1D1',
  grey: '#E8E8E8',
  blackSmoke: '#2D3034',
  slateGrey: '#1D2027',
  spaceGrey: '#15171A',
  neroGrey: '#222222',
  brownGrey: '#979797',
  pureWhite: '#FFFFFF',
  whiteSmoke: '#F2F2F2',
  pearlWhite: '#FAFAFA',
  lilyWhite: '#EEEFEE',
  transparentLilyWhite: 'rgba(238, 239, 238, 0.6)',
  transparentPureBlack: 'rgba(0, 0, 0, 0.6)',
  white100: '#FEFEFE',
  white60: '#ACAEB1',
  white20: '#5A5E63',
  royalBlue: '#2B6AFF',
  bittersweet: '#FD6565',
}

export const functionalColors = {
  errorLighter: palette.red.lighter,
  errorLight: palette.red.light,
  error: palette.red.default,
  errorDark: palette.red.dark,
  successLighter: palette.blue.lighter,
  successLight: palette.blue.light,
  success: palette.blue.default,
  successDark: palette.blue.dark,
  warningLighter: palette.yellow.lighter,
  warningLight: palette.yellow.light,
  warning: palette.yellow.default,
  warningDark: palette.yellow.dark,
  incidentSelected: palette.blue.default,
  //
  shadow: palette.pureBlack,
  activeTab: palette.royalBlue,
  inactiveTab: palette.brownGrey,
  liked: palette.bittersweet,
  primary: palette.blue.default,
  grey: palette.grey,
  pureWhite: palette.pureWhite,
  pureBlack: palette.pureBlack,
}

export function colorTheme(isDarkMode: boolean) {
  const accents = !isDarkMode
    ? {
        accent1: '#FAFAFA',
        accent2: '#EAEAEA',
        accent3: '#999',
        accent4: '#888',
        accent5: '#666',
        accent6: '#444',
        accent7: '#333',
        accent8: '#111',
      }
    : {
        accent1: '#111',
        accent2: '#333',
        accent3: '#666',
        accent4: '#444',
        accent5: '#888',
        accent6: '#999',
        accent7: '#EAEAEA',
        accent8: '#FAFAFA',
      }

  const lightTextNormal = palette.black100
  const lightTextDarker = palette.black60
  const lightTextDarkest = palette.black20
  const lightBackground = palette.pureWhite
  const lightBackgroundDarker = palette.pearlWhite
  const lightHeaderCap = palette.brownGrey
  const lightActionSheetBackground = palette.lilyWhite
  const lightBorder = palette.whiteSmoke
  const lightTransparentBackground = palette.transparentLilyWhite
  const darkTextNormal = palette.white100
  const darkTextLighter = palette.white60
  const darkTextLightest = palette.white20
  const darkBackground = palette.slateGrey
  const darkBackgroundLighter = palette.spaceGrey
  const darkHeaderCap = palette.white60
  const darkActionSheetBackground = palette.neroGrey
  const darkBorder = palette.blackSmoke
  const darkTransparentBackground = palette.transparentPureBlack

  // prettier-ignore
  return {
    foreground: isDarkMode ? palette.white : palette.black,
    ...accents,
    //
    ...functionalColors,
    textNormal:             isDarkMode ? darkTextNormal : lightTextNormal,
    textLight:              isDarkMode ? darkTextLighter : lightTextDarker,
    textLighter:            isDarkMode ? darkTextLightest : lightTextDarkest,
    background:             isDarkMode ? darkBackground : lightBackground,
    backgroundDarker:       isDarkMode ? darkBackgroundLighter : lightBackgroundDarker,
    headerCap:              isDarkMode ? darkHeaderCap : lightHeaderCap,
    actionSheetBackground:  isDarkMode ? darkActionSheetBackground : lightActionSheetBackground,
    border:                 isDarkMode ? darkBorder : lightBorder,
    transparentBackground:  isDarkMode ? darkTransparentBackground : lightTransparentBackground,
  }
}

export type Color = keyof ReturnType<typeof colorTheme>
