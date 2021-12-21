import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Box, Text } from '~/components/atomics'
import { userJwtToken } from '~/data/recoil'
import { useSignInMutation } from '~/hooks/mutations/SignInMutation'
import type { RootStackParams } from '~/RootNavigator'

export default function SignInScreen() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'SignIn'>>()

  const setJwtToken = useSetRecoilState(userJwtToken)
  const [signIn, isSending] = useSignInMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string>()

  const onSignInPressed = useCallback(() => {
    signIn(
      { username, password },
      {
        onOkResult: (res) => setJwtToken(res.accessToken),
        onErrResult: (res) => setErrorMsg(res.reason),
      },
    )
  }, [password, setJwtToken, signIn, username])

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="SignIn" onPress={onSignInPressed} />
      {isSending && <Text>sending</Text>}
      {errorMsg && <Text>{errorMsg}</Text>}
      <Box style={{ height: 100 }} />
      <Text>{'Or not have an account yet?'}</Text>
      <Button title="SignUp" onPress={() => rootNavigation.navigate('SignUp')} />
    </Box>
  )
}
