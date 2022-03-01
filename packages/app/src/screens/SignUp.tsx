import { t } from '@lazarus/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Keyboard, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, CustomHeader, Text, TextInput, TextInputType } from '~/components/v1'
import { useSignUpMutation } from '~/data/relay/mutations/SignUpMutation'
import type { MainStackNavProp } from '~/navigation/types'
import { getTextInputRules } from '~/shared/form/get-text-input-rules'
import { makeUseStyles } from '~/theme/v1'

const { emailInputRules, usernameInputRules, nameInputRules, passwordInputRules } =
  getTextInputRules()

type Form = {
  email: string
  username: string
  name: string
  password: string
  passwordConfirm: string
}

export function SignUp() {
  const nav = useNavigation<MainStackNavProp<'SignUp'>>()
  const s = useStyles()
  const [signUp, isSending] = useSignUpMutation()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [hidePassword, setHidePassword] = useState(true)
  const usernameInputRef = useRef<TextInputType>(null)
  const nameInputRef = useRef<TextInputType>(null)
  const passwordInputRef = useRef<TextInputType>(null)
  const passwordConfirmInputRef = useRef<TextInputType>(null)

  const {
    control,
    handleSubmit,
    errors: formErrors,
    formState,
  } = useForm<Form>({ mode: 'onChange' })

  const onSubmit = handleSubmit(async ({ email, username, name, password, passwordConfirm }) => {
    Keyboard.dismiss()

    if (password !== passwordConfirm) {
      setErrorMsg(t('errors.passwordsMismatch'))
      return
    }

    const result = await signUp({ email, name, username, password })
    result.map(
      () => nav.navigate('SignIn'),
      (err) => setErrorMsg(err.reasonIsTranslated ? err.reason : t('errors.generic')),
    )
  })

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={0}
      style={s.container}
    >
      <CustomHeader title={t('auth.signUp')} noShadow />
      <Image
        // source={colorScheme === 'dark' ? DarkLogo : LightLogo}
        style={s.logo}
        resizeMode="contain"
      />
      <View style={s.inputContainer}>
        {errorMsg && <Text style={s.errorMsg}>{errorMsg}</Text>}
        <Controller
          name="email"
          defaultValue=""
          rules={emailInputRules}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              error={formErrors.email != null}
              errorMsg={formErrors.email?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => usernameInputRef.current?.focus()}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              style={s.spacingBottom}
            />
          )}
        />
        <Controller
          name="username"
          defaultValue=""
          rules={usernameInputRules}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              inputRef={usernameInputRef}
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              error={formErrors.username != null}
              errorMsg={formErrors.username?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => nameInputRef.current?.focus()}
              autoCapitalize="none"
              style={s.spacingBottom}
            />
          )}
        />
        <Controller
          name="name"
          defaultValue=""
          rules={nameInputRules}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              inputRef={nameInputRef}
              label={t('auth.name')}
              placeholder={t('auth.namePlaceholder')}
              error={formErrors.name != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="words"
              style={s.spacingBottom}
            />
          )}
        />
        <Text size="s" style={s.label}>
          {t('auth.password') as string}
        </Text>
        <Controller
          name="password"
          defaultValue=""
          rules={passwordInputRules}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              inputRef={passwordInputRef}
              placeholder={t('auth.passwordPlaceholder')}
              error={formErrors.password != null}
              errorMsg={formErrors.password?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize={'none'}
              textContentType="password"
              secureTextEntry={hidePassword}
              style={s.spacingBottom}
              rightIcon={'Views'}
              onPressIcon={() => setHidePassword((prev) => !prev)}
              onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
            />
          )}
        />
        <Controller
          name="passwordConfirm"
          defaultValue=""
          rules={passwordInputRules}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              inputRef={passwordConfirmInputRef}
              placeholder={t('auth.passwordConfirmPlaceholder')}
              error={formErrors.passwordConfirm != null}
              errorMsg={formErrors.passwordConfirm?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize={'none'}
              textContentType="password"
              secureTextEntry={hidePassword}
              style={s.spacingBottom}
              rightIcon={'Views'}
              onPressIcon={() => setHidePassword((prev) => !prev)}
            />
          )}
        />
        <Button
          content={t('auth.signUp.submitButton')}
          large
          onPress={onSubmit}
          loading={isSending}
          disabled={!formState.isValid}
        />
        <View style={s.disclaimerContainer}>
          <Text style={s.disclaimerStyle}>{t('auth.signUpDisclaimer') as string}</Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const useStyles = makeUseStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  logo: {
    height: 20,
    width: '100%',
    marginVertical: spacing.xxxl,
  },
  disclaimerContainer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.m,
  },
  inlineColor: {
    color: colors.primary,
  },
  errorMsg: {
    color: colors.error,
    paddingBottom: spacing.xxl,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
  label: {
    paddingBottom: spacing.m,
    color: colors.accent4,
  },
}))
