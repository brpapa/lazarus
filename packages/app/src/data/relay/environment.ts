import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { SERVER_BASE_URL } from '~/shared/config'
import { JwtToken } from '../jwt-token-loader'

const getRequestHeaders = async () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const jwtToken = await JwtToken.get()
  if (jwtToken !== null)
    return {
      ...headers,
      Authorization: `Bearer ${jwtToken}`,
    }

  return headers
}

const network = Network.create(async (params, variables) => {
  console.log(`Fetching operation '${params.name}' with variables: ${JSON.stringify(variables)}`)

  let json = {} as any
  try {
    const headers = await getRequestHeaders()
    const response = await fetch(`${SERVER_BASE_URL}/graphql`, {
      method: 'POST',
      headers,
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

  if (json?.errors && Array.isArray(json.errors))
    throw new Error(
      `Error fetching GraphQL query '${params.name}' with variables '${JSON.stringify(
        variables,
      )}': ${JSON.stringify(json.errors)}`,
    )

  return json
})

/** store: where relay keeps  all the data returned from graphql operations around the app */
const store = new Store(new RecordSource(), {
  // This property tells Relay to not immediately clear its cache when the user navigates around the app. Relay will hold onto the specified number of query results, allowing the user to return to recently visited pages and reusing cached data if its available/fresh
  gcReleaseBufferSize: 10,
})

/** a singleton instance of Relay Environment configured with the network layer */
export const environment = new Environment({
  network,
  store,
})
