import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Text, TextInput, TextInputType } from '~/components/v1/atoms'
import { CustomHeader } from '~/components/v1/molecules/Header'
import { useSignInMutation } from '~/data/relay/mutations/SignInMutation'
import { useSession } from '~/hooks/use-session'
import type { MainStackNavProp } from '~/navigation/types'
import { makeUseStyles, useColorScheme } from '~/theme/v1'

type Form = {
  username: string
  password: string
}

export function SignIn() {
  const nav = useNavigation<MainStackNavProp<'SignIn'>>()

  const [hidePassword, setHidePassword] = useState(true)
  const { colorScheme } = useColorScheme()
  const s = useStyles()
  const passwordInputRef = useRef<TextInputType>(null)
  const [signIn, isSending] = useSignInMutation()
  const { startSession } = useSession()
  const [errorMsg, setErrorMsg] = useState<string>()

  const {
    control,
    handleSubmit,
    errors: formErrors,
    formState,
    reset,
  } = useForm<Form>({ mode: 'onChange' })

  const onSubmit = handleSubmit(async ({ username, password }) => {
    Keyboard.dismiss()
    const result = await signIn({ username, password })
    result.map(
      (res) => {
        startSession(
          {
            value: res.accessToken,
            expiresIn: new Date(res.accessTokenExpiresIn),
          },
          res.refreshToken,
        )
      },
      (err) => {
        setErrorMsg(err.reason)
        reset({ username: '', password: '' })
      },
    )
  })

  const onSignUpPressed = () => {
    Keyboard.dismiss()
    nav.navigate('SignUp')
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={0}
      style={s.container}
    >
      <CustomHeader
        title={t('auth.signIn')}
        rightTitle={t('auth.signUp')}
        onPressRight={onSignUpPressed}
        noShadow
      />
      {/* <Image
        source={colorScheme === 'dark' ? DarkLogo : LightLogo}
        style={s.logo}
        resizeMode="contain"
      /> */}
      <View style={s.formContainer}>
        {errorMsg && (
          <Text color="error" style={s.spacingBottom}>
            {errorMsg}
          </Text>
        )}
        <Controller
          name="username"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              error={formErrors.username != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="none"
              style={s.spacingBottom}
            />
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ onChange, value, onBlur }) => (
            <TextInput
              inputRef={passwordInputRef}
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              error={formErrors.password != null}
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
          content={t('auth.signIn.submitButton')}
          large
          onPress={onSubmit}
          loading={isSending}
          disabled={!formState.isValid}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  logo: {
    height: 120,
    width: '100%',
    marginVertical: spacing.xxxl,
    backgroundColor: colors.background,
  },
  formContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
}))
