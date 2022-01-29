import { t } from '@metis/shared'
import Slider from '@react-native-community/slider'
import { useNavigation, useRoute } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Text } from '~/components/v1/atoms'
import { HeaderItem, ModalHeader } from '~/components/v1/molecules'
import { SCREEN_WIDTH } from '~/shared/constants'
import type { RootStackNavProp, RootStackRouteProp } from '~/navigation/types'
import { makeUseStyles, useTheme } from '~/theme/v1'

export function DistanceRadiusPreference() {
  const s = useStyles()
  const { colors } = useTheme()
  const nav = useNavigation<RootStackNavProp<'DistanceRadiusPreference'>>()
  const route = useRoute<RootStackRouteProp<'DistanceRadiusPreference'>>()

  const [distRadius, setDistRadius] = useState<number>(0)

  useEffect(() => {
    setDistRadius(route?.params?.currentValue || 0)
  }, [route])

  const onSubmit = () => {
    // TODO: send distRadius
  }

  return (
    <View style={s.container}>
      <ModalHeader
        title={t('Distance radius')}
        left={<HeaderItem left label={t('back')} onPressItem={nav.goBack} />}
        right={<HeaderItem label={t('Submit')} onPressItem={onSubmit} />}
      />
      <ScrollView>
        <View style={s.bodyContainer}>
          <Text variant="body2" style={s.info}>
            {
              t(
                'Is the maximum distante from your current location which you are interested to listen by new incidents.',
              ) as string
            }
          </Text>

          <Text style={s.value}>
            {t('formatters.distance', { distInMeters: distRadius }) as string}
          </Text>

          <Slider
            style={s.slider}
            step={0.1}
            minimumValue={1}
            maximumValue={500}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.backgroundDarker}
            value={distRadius}
            onValueChange={(value) => setDistRadius(value)}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bodyContainer: {
    backgroundColor: colors.background,
    margin: spacing.l,
  },
  info: {
    marginBottom: spacing.xxl,
  },
  value: {
    textAlign: 'center',
  },
  slider: {
    width: SCREEN_WIDTH,
    height: 40,
  },
}))
