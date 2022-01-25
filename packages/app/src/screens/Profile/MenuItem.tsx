import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { ActivityIndicator, Dot, Icon, IconWithLabel } from '~/components/v1/atoms'
import type { IconName } from '~/icons'
import { makeUseStyles, useTheme } from '~/theme/v1'

type Props = TouchableOpacityProps & {
  title: string
  iconName: IconName
  iconColor?: string
  indicator?: boolean
  loading?: boolean
}

export function MenuItem(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()

  const { title, iconName, iconColor, indicator = false, loading, disabled, ...otherProps } = props

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
        <TouchableOpacity activeOpacity={1}>
          <Icon name="ChevronRight" color={colors.textLighter} />
        </TouchableOpacity>
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
