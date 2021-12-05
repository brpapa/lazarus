import React, { useEffect } from 'react'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import IncidentMarker from './IncidentMarker'
import type { IncidentMarkersQuery } from '~/__generated__/IncidentMarkersQuery.graphql'
import { selectedIncidentIdInMap } from '~/data/recoil'
import { useRecoilState } from 'recoil'

type IncidentMarkersProps = {
  preloadedQueryRef: PreloadedQuery<IncidentMarkersQuery>
}

export function IncidentMarkers(props: IncidentMarkersProps) {
  const data = usePreloadedQuery<IncidentMarkersQuery>(
    graphql`
      query IncidentMarkersQuery($input: IncidentsWithinBoundaryInput!) {
        incidents: incidentsWithinBoundary(input: $input) {
          incidentId
          ...IncidentMarker_incident
        }
      }
    `,
    props.preloadedQueryRef,
  )

  const [selectedIncidentId, setSelectedIncidentIdInMap] = useRecoilState(selectedIncidentIdInMap)

  return (
    <>
      {data.incidents.map((incident, i) => {
        if (incident === null) return null

        return (
          <IncidentMarker
            key={i}
            incident={incident}
            selected={selectedIncidentId === incident.incidentId}
            onPressed={() => {
              setSelectedIncidentIdInMap(incident.incidentId)
            }}
          />
        )
      })}
    </>
  )
}
