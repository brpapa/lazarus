import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import type { RootStackParams } from '~/App'
import { Box, Text } from '~/components/atomics'
import MyButton from '~/components/MyButton'
import { getPushToken } from '~/data/push-token'
import { useSignInMutation } from '~/data/relay/mutations/SignInMutation'
import { useSession } from '~/hooks/use-session'

export default function SignInScreen() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'SignIn'>>()

  const [signIn, isSending] = useSignInMutation()
  const { startSession } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string>()

  const onSignInPressed = useCallback(async () => {
    const pushToken = (await getPushToken()) ?? undefined
    signIn(
      { username, password, pushToken },
      {
        onOkResult: (res) =>
          startSession(
            { value: res.accessToken, expiresIn: new Date(res.accessTokenExpiresIn) },
            res.refreshToken,
          ),
        onErrResult: (res) => setErrorMsg(res.reason),
      },
    )
  }, [password, signIn, startSession, username])

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TextInput placeholder={t('username')} value={username} onChangeText={setUsername} />
      <TextInput
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <MyButton
        p="sm"
        mx="sm"
        my="md"
        label={t('signIn')}
        onPress={onSignInPressed}
        isLoading={isSending}
      />
      {errorMsg && <Text>{errorMsg}</Text>}
      <Box style={{ height: 100 }} />
      <Text>{t('callToSignUp')}</Text>
      <Button title={t('signUp')} onPress={() => rootNavigation.navigate('SignUp')} />
    </Box>
  )
}
