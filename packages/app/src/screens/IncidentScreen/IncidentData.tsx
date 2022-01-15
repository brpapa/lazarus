import React from 'react'
import { Image } from 'react-native'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { Box, Text } from '~/components/atomics'
import NotificationsAmount from '~/components/NotificationsAmount'
import { t } from '@metis/shared'
import type { IncidentDataQuery as IncidentDataQueryType } from '~/__generated__/IncidentDataQuery.graphql'

type IncidentDataProps = {
  preloadedQueryRef: PreloadedQuery<IncidentDataQueryType>
}

export function IncidentData(props: IncidentDataProps) {
  const data = usePreloadedQuery<IncidentDataQueryType>(
    graphql`
      query IncidentDataQuery($incidentId: String!) {
        incident(incidentId: $incidentId) {
          title
          medias {
            url
          }
          usersNotifiedCount
        }
      }
    `,
    props.preloadedQueryRef,
  )

  return (
    <>
      <Box>
        {/* TODO: image swiper com scroll view: https://www.youtube.com/watch?v=otr_x0wKgvU&t=679s */}
        {data
          .incident!.medias.filter((m) => m !== null)
          .map((media, idx) => (
            <Image key={idx} source={{ uri: media.url }} style={{ width: '100%', height: 400 }} />
          ))}
      </Box>
      <Box flex={1} m="md" bg="background">
        <Text mt="md" variant="header">
          {data.incident?.title}
        </Text>
        {/* <Text variant="subheader">{'Rua dos bobos, número 0'}</Text> */}

        <NotificationsAmount my="xs" amount={data.incident!.usersNotifiedCount} />

        <Text variant="title" mt="lg">
          {t('incident.updatesSectionTitle')}
        </Text>

        {/* <Box mb="md">
            {data.incident?.timelineUpdates.map((update, i) => (
              <Box key={i} mt="md">
                <Text variant="body2">{update.timestamp}</Text>
                <Text variant="body">{update.description}</Text>
              </Box>
            ))}
          </Box> */}
      </Box>
    </>
  )
}
