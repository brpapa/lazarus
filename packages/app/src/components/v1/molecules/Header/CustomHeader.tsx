import React, { useLayoutEffect } from 'react'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'

import { ActivityIndicator } from '~/components/v1/atoms'
import type { IconName } from '~/icons'
import { Color, makeUseStyles, useColorScheme, useTheme } from '~/theme/v1'

import { HeaderItem } from './HeaderItem'
import { t } from '@metis/shared'

type Props = {
  title?: string
  color?: Color
  noShadow?: boolean
  rightTitle?: string
  rightIcon?: IconName
  onPressRight?: () => void
  disabled?: boolean
  isLoading?: boolean
  prevScreen?: string
}

export function CustomHeader(props: Props) {
  const { colorScheme } = useColorScheme()
  const navigation = useNavigation()
  const styles = useStyles()
  const { colors, fontSizes, navHeader } = useTheme()

  const {
    title,
    color = 'background',
    rightTitle = '',
    rightIcon,
    onPressRight,
    noShadow = false,
    disabled = false,
    isLoading = false,
    prevScreen,
  } = props

  const statusBarStyle: StatusBarStyle = colorScheme === 'light' ? 'dark' : 'light'

  const headerRight = isLoading ? (
    <ActivityIndicator style={styles.headerRight} />
  ) : (
    onPressRight && (
      <HeaderItem
        label={rightTitle}
        icon={rightIcon}
        onPressItem={onPressRight}
        disabled={disabled}
        style={styles.headerRight}
      />
    )
  )

  const routesLength = useNavigationState((state) => state.routes.length)

  const headerLeft =
    routesLength > 1 ? (
      <HeaderBackButton
        label={t('back')}
        tintColor={isLoading ? colors.grey : colors.primary}
        style={isLoading && { opacity: 0.5 }}
        labelStyle={[
          {
            color: isLoading ? colors.grey : colors.primary,
            fontSize: fontSizes.m,
          },
        ]}
        disabled={isLoading}
        onPress={() => {
          prevScreen
            ? navigation.navigate(prevScreen, {
                backToTop: false,
              })
            : navigation.goBack()
        }}
      />
    ) : null

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      ...navHeader,
      headerStyle: {
        backgroundColor: colors[color],
        ...(noShadow && { shadowOpacity: 0, elevation: 0 }),
      },
      headerLeft: () => headerLeft,
      headerRight: () => headerRight,
    })
  }, [color, colors, headerLeft, headerRight, navHeader, navigation, noShadow, title])

  return <StatusBar style={statusBarStyle} />
}

const useStyles = makeUseStyles(({ spacing }) => ({
  headerRight: {
    paddingRight: spacing.xxl,
  },
}))
