import React from 'react'
import { graphql, PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay'
import { useRecoilState } from 'recoil'
import { selectedIncidentIdInMap } from '~/data/recoil'
import type { IncidentMarkersQuery as IncidentMarkersQueryType } from '~/__generated__/IncidentMarkersQuery.graphql'
import IncidentMarker from './IncidentMarker'
import type { IncidentMarkers_query$key } from '~/__generated__/IncidentMarkers_query.graphql'

type IncidentMarkersProps = {
  preloadedQuery: PreloadedQuery<IncidentMarkersQueryType>
}

export function IncidentMarkers(props: IncidentMarkersProps) {
  const [selectedIncidentId, setSelectedIncidentIdInMap] = useRecoilState(selectedIncidentIdInMap)

  const data = usePreloadedQuery<IncidentMarkersQueryType>(
    graphql`
      query IncidentMarkersQuery {
        ...IncidentMarkers_query
      }
    `,
    props.preloadedQuery,
  )

  const query = useFragment<IncidentMarkers_query$key>(
    graphql`
      fragment IncidentMarkers_query on Query {
        incidents(
          first: 2147483647 # max GraphQLInt
        ) @connection(key: "IncidentMarkers_incidents") {
          edges {
            node {
              incidentId
              ...IncidentMarker_incident
            }
          }
        }
      }
    `,
    data,
  )

  return (
    <>
      {query.incidents?.edges?.map((edge, i) =>
        edge === null ? null : (
          <IncidentMarker
            key={i}
            incident={edge.node}
            selected={selectedIncidentId === edge.node.incidentId}
            onPressed={() => setSelectedIncidentIdInMap(edge.node.incidentId)}
          />
        ),
      )}
    </>
  )
}
