/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { InitialState, NavigationState } from '@react-navigation/native'
import { ENABLE_NAVIGATION_STATE_PERSISTENCE } from '~/config'
import { isDeserializable, isSerializable } from '~/shared/utils'

const PERSISTENCE_KEY = 'NAVIGATION_STATE'

/** based on: https://reactnavigation.org/docs/state-persistence */
export const useNavigationStatePersistence = () => {
  if (!ENABLE_NAVIGATION_STATE_PERSISTENCE) return { isLoading: false, persistenceProps: {} }

  const [isLoading, setIsLoading] = useState(true)
  const [initialState, setInitialState] = useState<InitialState | undefined>(undefined)

  useEffect(() => {
    const loadInitialNavigationState = async () => {
      try {
        // const initialUrl = await Linking.getInitialURL() // if initialUrl == null there is no deep link

        if (Platform.OS !== 'web') {
          const persistedStateJson = await AsyncStorage.getItem(PERSISTENCE_KEY)

          if (persistedStateJson && !isDeserializable(persistedStateJson)) {
            console.warn('Unable to load the persisted navigation state')
          } else {
            const persistedState = persistedStateJson ? JSON.parse(persistedStateJson) : undefined
            if (persistedState !== undefined) setInitialState(persistedState)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoading) loadInitialNavigationState()
  }, [isLoading])

  const onStateChange = useCallback((state?: NavigationState) => {
    if (!isSerializable(state)) {
      console.warn('Unable to persist the new navigation state')
      return
    }
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
  }, [])

  return {
    isLoading,
    persistenceProps: { initialState, onStateChange },
  }
}
