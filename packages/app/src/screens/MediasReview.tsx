import { t } from '@metis/shared'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '~/components/v1/atoms'
import { CustomHeader } from '~/components/v1/molecules'
import { MediasCarousel } from '~/components/v1/organisms'
import type { ReportStackNavProp, ReportStackRouteProp } from '~/navigation/types'
import { SCREEN_HEIGHT } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'

// exemplo pra depois: ~/dev/@clones/react-native-vision-camera/example/src/MediaPage.tsx
export function MediasReview() {
  const s = useStyles()
  const insets = useSafeAreaInsets()
  const nav = useNavigation<ReportStackNavProp<'MediasReview'>>()
  const { params } = useRoute<ReportStackRouteProp<'MediasReview'>>()

  const recordOneMoreMedia = useCallback(() => {
    nav.reset({
      index: 0,
      routes: [{ name: 'Camera', params: { previousCapturedMedias: params.capturedMedias } }],
    })
  }, [params.capturedMedias, nav])

  const onReportPressed = () => {
    nav.navigate('ReportIncident', { capturedMedias: params.capturedMedias })
  }
  return (
    <View style={s.container}>
      <CustomHeader
        title={t('Review')}
        rightTitle={t('report.reportButton')}
        onPressRight={onReportPressed}
      />
      <MediasCarousel
        medias={params.capturedMedias}
        height={SCREEN_HEIGHT(insets) * 0.78}
        autoplay
      />

      <View style={s.buttonsContainer}>
        <Text variant="link" onPress={recordOneMoreMedia}>
          {t('report.recordOneMoreMedia') as string}
        </Text>
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, insets }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
    marginBottom: insets.bottom,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}))
