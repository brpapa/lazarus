import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import type { IconName } from '~/icons'
import { makeUseStyles, useTheme } from '~/theme/v1'
import { Dot, Icon, IconWithLabel, Text } from '../atoms'
import { ActivityIndicator } from '../atoms/ActivityIndicator'

type Props = TouchableOpacityProps & {
  title: string
  iconName: IconName
  iconColor?: string
  indicator?: boolean
  loading?: boolean
  rightText?: string
  showRightIcon?: boolean
}

export function MenuItem(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()

  const {
    title,
    iconName,
    iconColor,
    indicator = false,
    loading,
    showRightIcon = true,
    disabled,
    ...otherProps
  } = props

  return (
    <TouchableOpacity
      style={s.container}
      activeOpacity={0.2}
      disabled={disabled || loading}
      {...otherProps}
    >
      <IconWithLabel
        label={title}
        icon={iconName}
        color={iconColor}
        fontStyle={s.label}
        activeOpacity={1}
      />
      <View style={s.content}>
        {indicator && <Dot />}
        {loading && <ActivityIndicator />}
        {props.rightText && <Text>{props.rightText}</Text>}
        {props.showRightIcon && (
          <TouchableOpacity activeOpacity={1}>
            <Icon name="ChevronRight" color={colors.textLighter} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const useStyles = makeUseStyles(({ spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  label: {
    paddingLeft: spacing.xl,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}))
