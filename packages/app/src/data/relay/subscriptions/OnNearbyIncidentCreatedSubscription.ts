import { useEffect, useMemo } from 'react'
import { useRelayEnvironment } from 'react-relay'
import { graphql, GraphQLSubscriptionConfig, requestSubscription } from 'relay-runtime'
import { appendIncidentToConnection } from '~/data/relay/utils/store'
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

export const useOnNearbyIncidentCreatedSubscription = ({ when }: { when: boolean }) => {
  const environment = useRelayEnvironment()

  const subscriptionConfig = useMemo<GraphQLSubscriptionConfig<OnIncidentCreatedSubscriptionType>>(
    () => ({
      subscription,
      variables: {},
      updater: (store) => {
        // define how update the relay store when a new payload is received

        // get the incident record returned
        const incidentRecord = store.getRootField('onNearbyIncidentCreated') // relative to this subscription only
        if (!incidentRecord) throw new Error('Not found onNearbyIncidentCreated.incident record')

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
    if (!when) return

    const { dispose } = requestSubscription<OnIncidentCreatedSubscriptionType>(
      environment,
      subscriptionConfig,
    )
    return dispose
  }, [environment, when, subscriptionConfig])
}
