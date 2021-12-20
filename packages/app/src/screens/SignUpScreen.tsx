import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Box } from '~/components/atomics'
import { useAuth } from '~/hooks/use-auth'
import type { RootStackParams } from '~/RootNavigator'

export default function SignUpScreen() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'SignUp'>>()

  const { signUp } = useAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')

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
      <Button title="SignUp" onPress={() => signUp(username, password)} />
      <Box style={{ height: 100 }} />
      <Button
        title="Login"
        onPress={() => {
          rootNavigation.navigate('SignIn')
        }}
      />
    </Box>
  )
}
