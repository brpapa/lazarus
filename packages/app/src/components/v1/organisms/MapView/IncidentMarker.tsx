import React from 'react'
import { View } from 'react-native'
import { Marker } from 'react-native-maps'
import { graphql, useFragment } from 'react-relay'
import { makeUseStyles, useTheme } from '~/theme/v1'
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
  const { colors } = useTheme()
  const s = useStyles()
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
      <View style={s.incidentSquareContainer}>
        <View
          style={[
            s.incidentSquare,
            { backgroundColor: props.selected ? colors.accent7 : colors.accent7 }, // TODO: not showing color because is bugged
          ]}
        />
      </View>
    </Marker>
  )
}

const useStyles = makeUseStyles(() => ({
  incidentSquareContainer: {
    flex: 1,
  },
  incidentSquare: {
    borderRadius: 6,
    width: 17,
    height: 17,
  },
}))
