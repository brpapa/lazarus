import { loadQuery, PreloadedQuery } from 'react-relay'
import { atom } from 'recoil'
import { environment } from '~/data/relay/environment'
import type { HomeTabNavigatorQuery as HomeTabNavigatorQueryType } from '~/__generated__/HomeTabNavigatorQuery.graphql'
import HomeTabNavigatorQuery from '~/__generated__/HomeTabNavigatorQuery.graphql'

type InitialQueryRef = PreloadedQuery<HomeTabNavigatorQueryType>

const homeTabNavigatorQueryRef = loadQuery<HomeTabNavigatorQueryType>(
  environment,
  HomeTabNavigatorQuery,
  {},
  { fetchPolicy: 'network-only' },
)

export const initialQueryRefState = atom<InitialQueryRef>({
  key: 'initialQuery',
  default: homeTabNavigatorQueryRef,
})
