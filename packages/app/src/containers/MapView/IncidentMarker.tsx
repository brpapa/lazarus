import React, { useEffect } from 'react'
import { Marker } from 'react-native-maps'
import { graphql, useFragment } from 'react-relay'
import { useRecoilState } from 'recoil'
import { Box } from '~/components/atomics'
import { selectedIncidentIdInMap } from '~/data/recoil'
import type { IncidentMarker_incident$key } from '~/__generated__/IncidentMarker_incident.graphql'

type IncidentMarkerProps = {
  incident: IncidentMarker_incident$key
  selected: boolean
  onPressed: () => void
}

function IncidentMarker(props: IncidentMarkerProps) {
  const data = useFragment(
    graphql`
      fragment IncidentMarker_incident on Incident {
        incidentId
        coordinate {
          latitude
          longitude
        }
      }
    `,
    props.incident,
  )


  return (
    <Marker
      coordinate={data.coordinate}
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

export default IncidentMarker
