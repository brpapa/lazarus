import React, { useEffect } from 'react'
import { Marker } from 'react-native-maps'
import { graphql, useFragment } from 'react-relay'
import { XStack } from '~/components/atomics'
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
      <XStack flex={1}>
        <XStack
          borderRadius={6}
          backgroundColor={props.selected ? '$5AF' : '#F20'}
          width={17}
          height={17}
        />
      </XStack>
    </Marker>
  )
}

export default IncidentMarker
