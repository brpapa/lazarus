import { t } from '@metis/shared'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '~/components/v1/atoms'
import { CustomHeader } from '~/components/v1/molecules'
import { MediasCarousel } from '~/components/v1/organisms'
import type { ReportStackNavProp, ReportStackRouteProp } from '~/navigation/types'
import { MediaType, SCREEN_HEIGHT } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'

// TODO
const CAPTURED_MEDIAS: Media[] = [
  {
    type: MediaType.IMAGE,
    uri: 'https://metis-public-static-content.s3.amazonaws.com/91cacff3-c5f3-4b7e-93c7-37098dee928e.jpg',
  },
  {
    type: MediaType.VIDEO,
    uri: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
  },
]

export function MediasReview() {
  const s = useStyles()
  const insets = useSafeAreaInsets()
  const nav = useNavigation<ReportStackNavProp<'MediasReview'>>()
  const { params } = useRoute<ReportStackRouteProp<'MediasReview'>>()

  const recordOneMoreMedia = useCallback(() => {
    nav.replace('Camera', { previousCapturedMedias: params.capturedMedias })
  }, [params.capturedMedias, nav])

  const onReportPressed = () => {
    nav.navigate('ReportIncident', { capturedMedias: params.capturedMedias })
  }
  return (
    <View style={[s.container, { marginBottom: insets.bottom }]}>
      <CustomHeader
        title={t('Review')}
        rightTitle={t('report.reportButton')}
        onPressRight={onReportPressed}
      />
      <MediasCarousel medias={CAPTURED_MEDIAS} height={SCREEN_HEIGHT * 0.78} />

      <View style={s.buttonsContainer}>
        <Text variant="link" onPress={recordOneMoreMedia}>
          {t('report.recordOneMoreMedia') as string}
        </Text>
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}))
