import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { useRecoilValue } from 'recoil'
import { FloatingButton, Text } from '~/components/v1/atoms'
import { userLocationState } from '~/data/recoil'
import type { HomeTabNavProp } from '~/navigation/types'
import { makeUseStyles } from '~/theme/v1'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'
import { IconWithLabel } from '../atoms'

type IncidentPreviewProps = {
  preloadedQuery: PreloadedQuery<IncidentPreviewQueryType>
  closeable: boolean
  onClosed?: () => void
}

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

export default function IncidentPreview(props: IncidentPreviewProps) {
  if (!props.closeable && props.onClosed)
    throw new Error('Invalid props: component should be closeable to have the onClosed prop')

  const s = useStyles()

  const nav = useNavigation<HomeTabNavProp<'Explorer'>>()
  const userLocation = useRecoilValue(userLocationState)

  const data = usePreloadedQuery<IncidentPreviewQueryType>(query, props.preloadedQuery)

  const onTouched = useCallback(() => {
    nav.push('IncidentDetail', {
      incidentId: data.incident?.incidentId!,
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={onTouched}>
      <View style={s.container}>
        <Text variant="header">{data.incident?.title}</Text>
        <View style={s.lowerContainer}>
          <Text variant="body2">
            {
              t('incident.createdAt', {
                createdAt: new Date(data!.incident!.createdAt),
              }) as string
            }
          </Text>
          <Text variant="body2">
            {
              t('incident.distanceToUser', {
                segment: [data.incident!.location, userLocation],
              }) as string
            }
          </Text>
        </View>

        <IconWithLabel
          icon="Bell"
          label={
            t('incident.amountOfPeopleNotified', {
              count: data.incident!.usersNotifiedCount,
            }) as string
          }
        />

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
    paddingRight: spacing.xl,
    paddingLeft: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    borderRadius: 5,
    borderColor: colors.accent2,
    borderWidth: 1,
  },
  lowerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
}))
