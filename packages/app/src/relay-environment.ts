import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime'
import { SERVER_BASE_URL } from './shared/config'

const fetchRelay: FetchFunction = async (params, variables) => {
  console.log(`Fetching query ${params.name} with variables: ${JSON.stringify(variables)}`)

  let json = {} as any
  try {
    const response = await fetch(`${SERVER_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    })
    json = await response.json()
  } catch (e) {
    throw new Error(
      `Unexpected error fetching GraphQL query '${params.name}': ${JSON.stringify(e)}`,
    )
  }

  if (json?.errors && Array.isArray(json.errors)) {
    throw new Error(
      `Error fetching GraphQL query '${params.name}' with variables '${JSON.stringify(
        variables,
      )}': ${JSON.stringify(json.errors)}`,
    )
  }

  return json
}

/** a singleton instance of Relay Environment configured with the network layer */
export const environment = new Environment({
  network: Network.create(fetchRelay),
  // store = cache
  store: new Store(new RecordSource(), {
    // This property tells Relay to not immediately clear its cache when the user navigates around the app. Relay will hold onto the specified number of query results, allowing the user to return to recently visited pages and reusing cached data if its available/fresh
    gcReleaseBufferSize: 10,
  }),
})
1
