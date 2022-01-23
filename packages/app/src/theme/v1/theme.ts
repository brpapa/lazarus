import { t } from '@metis/shared'
import { TransitionPresets } from '@react-navigation/stack'
import {
  colorTheme,
  fontSizes,
  fontVariants, iconSizes,
  spacing
} from './constants'
import { floatingButtonSizes } from './constants/buttons'

// This is information about the device or system, which the theme might depend on, such as light/dark mode.
export type Config = {
  colorScheme: 'light' | 'dark' | 'no-preference'
  aesthetic: 'ios' | 'android'
}

export const getTheme = ({ colorScheme, aesthetic }: Config) => {
  const isDarkMode = colorScheme === 'dark'
  const colors = colorTheme(isDarkMode)

  return {
    colors,
    fontSizes: fontSizes,
    iconSizes: iconSizes,
    spacing: spacing,
    fontVariants: fontVariants(isDarkMode),
    floatingButtonSizes,
    shadow: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.6 : 0.08,
      elevation: 2,
    },
    navHeader: {
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        color: colors.textNormal,
        fontSize: fontSizes.l,
      },
      headerTitleAlign: 'center',
      headerBackTitleStyle: {
        color: colors.primary,
        fontSize: fontSizes.m,
      },
      headerBackTitle: t('back'),
    } as const,
    navModal:
      aesthetic === 'ios' &&
      ({
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      } as const),
    navNoShadow: {
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: colors.background,
      },
    },
  }
}

export type Theme = ReturnType<typeof getTheme>
export type FontSize = keyof typeof fontSizes
export type FontVariant = keyof ReturnType<typeof fontVariants>
export type IconSize = keyof typeof iconSizes
export type FloatingButtonSize = keyof typeof floatingButtonSizes
export type Spacing = keyof typeof spacing
export type Color = keyof ReturnType<typeof colorTheme>
