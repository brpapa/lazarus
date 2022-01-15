import React from 'react'
import { graphql, useFragment } from 'react-relay'
import { useRecoilState } from 'recoil'
import { selectedIncidentIdInMap } from '~/data/recoil'
import type { IncidentMarkerList_query$key } from '~/__generated__/IncidentMarkerList_query.graphql'
import { IncidentMarker } from './IncidentMarker'

type IncidentMarkersProps = {
  queryRef: IncidentMarkerList_query$key
}

const frag = graphql`
  fragment IncidentMarkerList_query on Query {
    incidents(
      first: 2147483647 # max GraphQLInt
    ) @connection(key: "IncidentMarkerList_incidents") {
      edges {
        node {
          incidentId
          ...IncidentMarker_incident
        }
      }
    }
  }
`

export function IncidentMarkerList(props: IncidentMarkersProps) {
  const data = useFragment<IncidentMarkerList_query$key>(frag, props.queryRef)

  const [selectedIncidentId, setSelectedIncidentIdInMap] = useRecoilState(selectedIncidentIdInMap)

  const nodes = data?.incidents?.edges
    ? data.incidents.edges.flatMap((e) => (e ? [e.node] : []))
    : []

  return (
    <>
      {nodes.map((node, i) => (
        <IncidentMarker
          key={i}
          incidentRef={node}
          selected={selectedIncidentId === node.incidentId}
          onPressed={() => setSelectedIncidentIdInMap(node.incidentId)}
        />
      ))}
    </>
  )
}
