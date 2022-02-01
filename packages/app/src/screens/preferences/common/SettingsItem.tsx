import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Icon, Text } from '~/components/v1'
import { makeUseStyles, useTheme } from '~/theme/v1'

type Props = TouchableOpacityProps & {
  title: string
  selected?: boolean
}

export function SettingsItem(props: Props) {
  const s = useStyles()
  const { colors } = useTheme()

  const { title, selected, ...otherProps } = props

  return (
    <TouchableOpacity style={s.container} activeOpacity={0.2} {...otherProps}>
      <Text>{title}</Text>
      {selected && (
        <View style={s.content}>
          <TouchableOpacity activeOpacity={1}>
            <Icon name="Done" color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}

const useStyles = makeUseStyles(({ spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    height: 52,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}))
