import {
  Environment,
  FetchFunction,
  Network,
  Observable,
  RecordSource,
  Store,
  SubscribeFunction,
} from 'relay-runtime'
import { HTTP_SERVER_BASE_URL, WS_SERVER_BASE_URL } from '~/shared/config'
import { SecureStoreProxy } from '../secure-store-proxy'
import { createClient } from 'graphql-ws'

const fetchFn: FetchFunction = async (operation, variables) => {
  console.log(`Fetching operation '${operation.name}' with variables: ${JSON.stringify(variables)}`)

  let json = {} as any
  try {
    const headers = await getRequestHeaders()
    const response = await fetch(`${HTTP_SERVER_BASE_URL}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
    json = await response.json()
  } catch (e) {
    throw new Error(
      `Unexpected error fetching GraphQL operation '${operation.name}': ${JSON.stringify(e)}`,
    )
  }

  if (json?.errors && Array.isArray(json.errors))
    throw new Error(
      `Error fetching GraphQL operation '${operation.name}' with variables '${JSON.stringify(
        variables,
      )}': ${JSON.stringify(json.errors)}`,
    )

  return json

  async function getRequestHeaders() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const accessToken = await SecureStoreProxy.getAccessToken()
    if (accessToken !== null)
      return {
        ...headers,
        Authorization: `Bearer ${accessToken.value}`,
      }

    return headers
  }
}

const subscriptionsClient = createClient({
  url: `${WS_SERVER_BASE_URL}/graphql/subscriptions`,
  connectionParams: async () => {
    const accessToken = await SecureStoreProxy.getAccessToken()
    if (accessToken === null) return {}
    return { Authorization: `Bearer ${accessToken.value}` }
  },
})

const subscribeFn: SubscribeFunction = (operation, variables) => {
  return Observable.create((sink) => {
    if (!operation.text) return sink.error(new Error('Operation text cannot be empty'))

    return subscriptionsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      // @ts-ignore
      {
        ...sink,
        error: (err) => {
          if (Array.isArray(err))
            return sink.error(new Error(err.map(({ message }) => message).join(', '))) // GraphQLError[]

          return sink.error(err as Error)
        },
      },
    )
  })
}

const network = Network.create(fetchFn, subscribeFn)

/** store: where relay keeps all the data returned from graphql operations around the app */
const store = new Store(new RecordSource(), {
  // this property tells Relay to not immediately clear its cache when the user navigates around the app. Relay will hold onto the specified number of query results, allowing the user to return to recently visited pages and reusing cached data if its available/fresh
  gcReleaseBufferSize: 10,
})

/** a singleton instance of Relay Environment configured with the network layer */
export const environment = new Environment({
  network,
  store,
})
