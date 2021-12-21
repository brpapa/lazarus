import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Box, Text } from '~/components/atomics'
import Loading from '~/components/Loading'
import { useSignUpMutation } from '~/hooks/mutations/SignUpMutation'
import type { RootStackParams } from '~/RootNavigator'

export default function SignUpScreen() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'SignUp'>>()
  const [signUp, isSending] = useSignUpMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errorMsg, setErrorMsg] = useState<string>()

  const onSignUpPressed = useCallback(() => {
    if (password !== passwordConfirm) {
      setErrorMsg('Passwords mismatch')
      return
    }
    signUp(
      { username, password },
      {
        onOkResult: () => rootNavigation.navigate('SignIn'),
        onErrResult: (res) => setErrorMsg(res.reason),
      },
    )
  }, [password, passwordConfirm, rootNavigation, signUp, username])

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <Button title="SignUp" onPress={onSignUpPressed} />
      {isSending && <Text>sending</Text>}
      {errorMsg && <Text>{errorMsg}</Text>}
      <Box style={{ height: 100 }} />
      <Text>{'Or already have an account?'}</Text>
      <Button title="SignIn" onPress={() => rootNavigation.navigate('SignIn')} />
    </Box>
  )
}
