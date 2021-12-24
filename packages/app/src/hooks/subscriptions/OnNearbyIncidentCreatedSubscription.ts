import { appendIncidentToConnection } from './../../data/relay/utils'
import { useEffect, useMemo } from 'react'
import { useRelayEnvironment } from 'react-relay'
import {
  ConnectionHandler,
  graphql,
  GraphQLSubscriptionConfig,
  requestSubscription,
} from 'relay-runtime'
import type { OnIncidentCreatedSubscription as OnIncidentCreatedSubscriptionType } from '~/__generated__/OnIncidentCreatedSubscription.graphql'

const subscription = graphql`
  subscription OnNearbyIncidentCreatedSubscription {
    onNearbyIncidentCreated {
      id
      incidentId
      title
      location {
        latitude
        longitude
      }
    }
  }
`

export const useOnNearbyIncidentCreatedSubscription = ({ isOn }: { isOn: boolean }) => {
  const environment = useRelayEnvironment()

  const subscriptionConfig = useMemo<GraphQLSubscriptionConfig<OnIncidentCreatedSubscriptionType>>(
    () => ({
      subscription,
      variables: {},
      onCompleted: () => {
        console.log('Subscription established')
      },
      onNext: (response) => {
        console.log('Subscription payload received', response)
      },
      updater: (store) => {
        // define how update the relay store when a new payload is received

        // get the incident record returned
        const incidentRecord = store.getRootField('onNearbyIncidentCreated') // relative to this subscription only
        if (!incidentRecord) throw new Error('Not found incident record in subscription payload')

        appendIncidentToConnection(store, incidentRecord)
      },
      onError: (error) => {
        console.log('Subscription error', error)
      },
    }),
    [],
  )

  // this will resubscribe every render if subscriptionConfig is not memoized
  useEffect(() => {
    if (!isOn) return
    const { dispose } = requestSubscription<OnIncidentCreatedSubscriptionType>(
      environment,
      subscriptionConfig,
    )
    return dispose
  }, [environment, isOn, subscriptionConfig])
}
