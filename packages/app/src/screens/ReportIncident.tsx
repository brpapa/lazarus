import { t } from '@lazarus/shared'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, SafeAreaView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, HeaderItem, ModalHeader, Text, TextInput } from '~/components/v1'
import { useReportIncidentMutation } from '~/data/relay/mutations/ReportIncidentMutation'
import type { RootStackNavProp, RootStackRouteProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'

type Form = {
  title: string
}

export function ReportIncident() {
  const s = useStyles()
  const nav = useNavigation<RootStackNavProp<'ReportIncident'>>()
  const { params } = useRoute<RootStackRouteProp<'ReportIncident'>>()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [reportIncident, isSending] = useReportIncidentMutation()
  const {
    control,
    handleSubmit,
    errors: formErrors,
    formState,
    reset,
  } = useForm<Form>({ mode: 'onChange', reValidateMode: 'onChange' })

  const onSubmit = handleSubmit(async ({ title }) => {
    Keyboard.dismiss()
    const result = await reportIncident({
      title: title,
      medias: params.capturedMedias,
    })

    result.map(
      () => {
        nav.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      },
      (err) => {
        setErrorMsg(err.reasonIsTranslated ? err.reason : t('errors.generic'))
        reset({ title: '' })
      },
    )
  })

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={0}
        style={s.scrollViewContainer}
      >
        <ModalHeader
          title={t('report.header')}
          left={<HeaderItem label={t('cancel')} onPressItem={nav.goBack} left />}
        />
        <View style={s.titleInputContainer}>
          {errorMsg && (
            <Text color="error" style={s.spacingBottom}>
              {errorMsg}
            </Text>
          )}
          <Controller
            name="title"
            defaultValue=""
            rules={{ required: true }}
            control={control}
            render={({ onChange, value, onBlur }) => (
              <TextInput
                label={t('report.title')}
                placeholder={t('report.titlePlaceholder')}
                error={formErrors.title != null}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                autoCapitalize="none"
                style={s.spacingBottom}
              />
            )}
          />
          <Button
            content={t('report.reportButton')}
            large
            onPress={onSubmit}
            loading={isSending}
            disabled={!formState.isValid}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
  titleInputContainer: {
    paddingTop: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
}))
