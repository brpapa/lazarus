import React from 'react'
import { Marker } from 'react-native-maps'
import { graphql, useFragment } from 'react-relay'
import { Box } from '~/components/atomics'
import type { IncidentMarker_incident$key } from '~/__generated__/IncidentMarker_incident.graphql'

type IncidentMarkerProps = {
  incidentRef: IncidentMarker_incident$key
  selected: boolean
  onPressed: () => void
}

const frag = graphql`
  fragment IncidentMarker_incident on Incident {
    incidentId
    location {
      latitude
      longitude
    }
  }
`

export function IncidentMarker(props: IncidentMarkerProps) {
  const data = useFragment<IncidentMarker_incident$key>(frag, props.incidentRef)

  return (
    <Marker
      coordinate={data.location}
      tracksViewChanges={false}
      onPress={(e) => {
        e.stopPropagation()
        props.onPressed()
      }}
    >
      <Box flex={1}>
        <Box
          borderRadius={6}
          bg={props.selected ? 'incident-selected' : 'accents-7'}
          width={17}
          height={17}
        />
      </Box>
    </Marker>
  )
}
