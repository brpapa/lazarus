import { t } from '@metis/shared'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Image, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, FloatingButton, Text } from '~/components/v1/atoms'
import { useReportIncidentMutation } from '~/data/relay/mutations/ReportIncidentMutation'
import { useSession } from '~/hooks/use-session'
import type { ReportStackNavProp, ReportStackRouteProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'

export function Medias() {
  const s = useStyles()
  const insets = useSafeAreaInsets()
  const nav = useNavigation<ReportStackNavProp<'Medias'>>()
  const { params } = useRoute<ReportStackRouteProp<'Medias'>>()

  const [title, setTitle] = useState('')

  const backToCamera = useCallback(() => {
    nav.replace('Camera', { previousCapturedPictures: params.capturedPictures })
  }, [params.capturedPictures, nav])

  const closeReport = useCallback(() => {
    nav.popToTop()
    nav.goBack()
  }, [nav])

  const [reportIncident, isSending] = useReportIncidentMutation()
  const { closeSession } = useSession()

  const onReportButtonPressed = useCallback(async () => {
    const result = await reportIncident({
      title: title,
      pictures: params.capturedPictures,
    })

    result.map(
      () => closeReport(),
      (err) => {
        if (err.code === 'UnauthenticatedError') closeSession()
      },
    )
  }, [closeReport, closeSession, params.capturedPictures, reportIncident, title])

  return (
    <View style={s.container}>
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        {params.capturedPictures.map((media, i) => (
          <Image
            key={i}
            source={{ uri: media.uri }}
            style={{ width: '100%', height: 400 }}
            resizeMode="cover"
          />
        ))}

        <Text variant="link" onPress={backToCamera}>
          Adicionar outra midia
        </Text>

        <Text variant="header">{t('report.title') as string}</Text>

        <TextInput
          style={{ padding: 15, height: 50, fontSize: 24 }}
          value={title}
          placeholder={'Digite um título para o alerta'}
          onChangeText={(value) => setTitle(value)}
          onSubmitEditing={() => {
            if (!title) return // Don't submit if empty
            setTitle('')
          }}
        />
      </ScrollView>
      <View style={{ position: 'absolute', right: insets.right + 10, top: insets.top + 10 }}>
        <FloatingButton
          icon={'Close'}
          onPress={closeReport}
          // my={'sm'}
        />
      </View>
      <View
        flexGrow={1}
        bg="background"
        mx="sm"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Button
          // p="sm"
          // mx="sm"
          // my="md"
          content={t('report.reportButton') as string}
          onPress={onReportButtonPressed}
          loading={isSending}
        />
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
  },
  lowerContainer: {
    flex: 1,
  },
}))
