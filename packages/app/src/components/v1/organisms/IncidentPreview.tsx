import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { useRecoilValue } from 'recoil'
import { FloatingButton, Text } from '~/components/v1'
import { userLocationState } from '~/data/recoil'
import type { HomeTabNavProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'

const query = graphql`
  query IncidentPreviewQuery($id: String!) {
    incident(incidentId: $id) {
      incidentId
      title
      location {
        latitude
        longitude
      }
      usersNotifiedCount
      createdAt
    }
  }
`

type IncidentPreviewProps = {
  incidentId: string
  closeable: boolean
  onClosed?: () => void
}

export function IncidentPreview(props: IncidentPreviewProps) {
  if (!props.closeable && props.onClosed)
    throw new Error('Invalid props: component should be closeable to have the onClosed prop')

  const s = useStyles()
  const nav = useNavigation<HomeTabNavProp<'Explorer'>>()
  const userLocation = useRecoilValue(userLocationState)

  const data = useLazyLoadQuery<IncidentPreviewQueryType>(
    query,
    { id: props.incidentId },
    { fetchPolicy: 'store-or-network' },
  )

  const onTouched = useCallback(() => {
    if (!data.incident?.incidentId) return

    nav.push('IncidentDetail', {
      incidentId: data.incident.incidentId,
    })
  }, [data])

  return (
    <TouchableWithoutFeedback onPress={onTouched}>
      <View style={s.container}>
        {data?.incident && (
          <>
            <Text variant="title">{data.incident.title}</Text>
            <View style={s.row}>
              <Text variant="body2">
                {
                  t('formatters.relativeTimeToNow', {
                    time: new Date(data.incident.createdAt),
                  }) as string
                }
              </Text>
              <Text variant="body2">
                {
                  t('incident.distanceToUser', {
                    segment: [data.incident.location, userLocation],
                  }) as string
                }
              </Text>
            </View>
          </>
        )}

        {props.closeable && (
          <FloatingButton
            icon="Close"
            style={{ position: 'absolute', top: -45, right: 0 }}
            onPress={props.onClosed}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    margin: spacing.m,
    paddingTop: spacing.m,
    paddingRight: spacing.l,
    paddingLeft: spacing.l,
    borderRadius: 5,
    borderColor: colors.accent2,
    borderWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
}))
