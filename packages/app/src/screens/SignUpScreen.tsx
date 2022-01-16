import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Box, Text } from '~/components/atomics'
import MyButton from '~/components/MyButton'
import { useSignUpMutation } from '~/data/relay/mutations/SignUpMutation'
import type { RootStackParams } from '~/RootNavigator'

export default function SignUpScreen() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'SignUp'>>()
  const [signUp, isSending] = useSignUpMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errorMsg, setErrorMsg] = useState<string>()

  const onSignUpPressed = useCallback(async () => {
    if (password !== passwordConfirm) {
      setErrorMsg('Passwords mismatch')
      return
    }
    const result = await signUp({ username, password })
    result.map(
      () => rootNavigation.navigate('SignIn'),
      (err) => setErrorMsg(err.reason),
    )
  }, [password, passwordConfirm, rootNavigation, signUp, username])

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TextInput placeholder={t('username')} value={username} onChangeText={setUsername} />
      <TextInput
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder={t('passwordConfirm')}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <MyButton
        p="sm"
        mx="sm"
        my="md"
        label={t('signUp')}
        onPress={onSignUpPressed}
        isLoading={isSending}
      />
      {errorMsg && <Text>{errorMsg}</Text>}
      <Box style={{ height: 100 }} />
      <Text>{t('callToSignIn')}</Text>
      <Button title={t('signIn')} onPress={() => rootNavigation.navigate('SignIn')} />
    </Box>
  )
}
