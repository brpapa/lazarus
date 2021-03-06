import {
  Environment,
  FetchFunction,
  Network,
  Observable,
  RecordSource,
  Store,
  SubscribeFunction,
} from 'relay-runtime'
import { SERVER_HTTP_BASE_URL, SERVER_WS_BASE_URL } from '@env'
import { AuthTokensManager } from '../storage/auth-tokens-manager'
import { CloseCode, createClient } from 'graphql-ws'

async function createRequestHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const accessToken = await AuthTokensManager.getAccessToken()
  if (accessToken !== null)
    return {
      ...headers,
      Authorization: `Bearer ${accessToken.value}`,
    }

  return headers
}

const fetchFn: FetchFunction = async (operation, variables) => {
  console.debug(
    `[graphql] Fetching operation '${operation.name}' with variables: ${JSON.stringify(variables)}`,
  )

  let json = {} as any
  try {
    const headers = await createRequestHeaders()
    const response = await fetch(`${SERVER_HTTP_BASE_URL}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
    json = await response.json()
  } catch (e) {
    console.error(e)
    throw new Error(
      `Unexpected error fetching GraphQL operation '${operation.name}'`,
    )
  }

  if (json?.errors && Array.isArray(json.errors))
    throw new Error(
      `Error fetching GraphQL operation '${operation.name}' with variables '${JSON.stringify(
        variables,
      )}': ${JSON.stringify(json.errors)}`,
    )

  return json
}

const subscriptionsClient = createClient({
  url: `${SERVER_WS_BASE_URL}/graphql/subscriptions`,
  connectionParams: async () => {
    const accessToken = await AuthTokensManager.getAccessToken()
    if (accessToken === null) return {}
    return { Authorization: `Bearer ${accessToken.value}` }
  },
  on: {
    connected: () => {
      console.log('[graphql] Connection established')
    },
    closed: (event: any) => {
      console.log('[graphql] Connection closed', event)

      if (event.code == CloseCode.Forbidden) {
        console.log('[graphql] The access token expired') // in the next connection try it should be already refreshed (by useSession hook)
      }
    },
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
