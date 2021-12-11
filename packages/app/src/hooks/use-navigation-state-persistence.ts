import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { InitialState, NavigationState } from '@react-navigation/native'
import { ENABLE_NAVIGATION_STATE_PERSISTENCE } from '~/shared/config'
import { isDeserializable, isSerializable } from '~/shared/utils'

/** based on: https://reactnavigation.org/docs/state-persistence */
export const useNavigationStatePersistence = (key: string) => {
  const [isReady, setIsReady] = useState(false)
  const [initialState, setInitialState] = useState<InitialState | undefined>(undefined)

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        // const initialUrl = await Linking.getInitialURL() // if initialUrl == null there is no deep link

        if (ENABLE_NAVIGATION_STATE_PERSISTENCE && Platform.OS !== 'web') {
          const persistedStateJson = await AsyncStorage.getItem(key)

          if (persistedStateJson && !isDeserializable(persistedStateJson)) {
            console.warn('Unable to load the persisted navigation state')
          }

          const state = persistedStateJson ? JSON.parse(persistedStateJson) : undefined

          if (state !== undefined) {
            setInitialState(state)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) loadPersistedState()
  }, [isReady, key])

  const onStateChange = useCallback(
    (state?: NavigationState) => {
      if (!isSerializable(state)) {
        console.warn('Unable to persist the new navigation state')
        return
      }
      AsyncStorage.setItem(key, JSON.stringify(state))
    },
    [key],
  )

  return {
    isReady,
    persistenceProps: { initialState, onStateChange },
  }
}
