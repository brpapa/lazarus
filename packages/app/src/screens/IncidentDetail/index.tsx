import { t } from '@metis/shared'
import { useNavigation, useRoute } from '@react-navigation/core'
import { default as React, Suspense, useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay'
import { useRecoilValue } from 'recoil'
import { FloatingButton, IconWithLabel, Loading, Text } from '~/components/v1/atoms'
import { MediasCarousel } from '~/components/v1/organisms'
import { SCREEN_HEIGHT } from '~/config'
import { userLocationState } from '~/data/recoil'
import type { MainStackNavProp, MainStackRouteProp } from '~/navigation/types'
import { MediaType } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { IncidentDetailQuery as IncidentDetailQueryType } from '~/__generated__/IncidentDetailQuery.graphql'
import IncidentDetailQuery from '~/__generated__/IncidentDetailQuery.graphql'

// TODO
const INCIDENT_OWNER_USER_ID = 'a'
const INCIDENT_OWNER_USER_NAME = 'Reginaldo'
const VIEWS_COUNT = 11231
const REPLIES_COUNT = 10
const REACTIONS_COUNT = 2
const FORMATTED_ADDRESS = 'Rua Solaine da Silva Golçalves, 64 - Botucatu - São Paulo'
const MEDIAS: Media[] = [
  {
    type: MediaType.IMAGE,
    uri: 'https://metis-public-static-content.s3.amazonaws.com/91cacff3-c5f3-4b7e-93c7-37098dee928e.jpg',
  },
  {
    type: MediaType.VIDEO,
    uri: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
  },
  {
    type: MediaType.VIDEO,
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  },
]

const query = graphql`
  query IncidentDetailQuery($incidentId: String!) {
    incident(incidentId: $incidentId) {
      incidentId
      title
      medias {
        url
      }
      usersNotifiedCount
      createdAt
      location {
        latitude
        longitude
      }
    }
  }
`

type Props = {
  preloadedQueryRef: PreloadedQuery<IncidentDetailQueryType>
}

function IncidentDetail(props: Props) {
  const nav = useNavigation<MainStackNavProp<'IncidentDetail'>>()
  const { params } = useRoute<MainStackRouteProp<'IncidentDetail'>>()

  const s = useStyles()
  const data = usePreloadedQuery<IncidentDetailQueryType>(query, props.preloadedQueryRef)
  const userLocation = useRecoilValue(userLocationState)

  const insets = useSafeAreaInsets()

  const onCommentsPressed = () => {
    nav.navigate('IncidentComments', { incidentId: params.incidentId })
  }
  const onClosePressed = () => {
    nav.pop()
  }
  const onUserOwnerClick = () => {
    // TODO: go to user screen passing INCIDENT_OWNER_USER_ID
  }

  return (
    <View style={s.container}>
      <ScrollView style={s.scrollableContainer}>
        <MediasCarousel medias={MEDIAS} height={SCREEN_HEIGHT * 0.65} />
        <View style={s.contentContainer}>
          <Text variant="header">{data.incident?.title}</Text>
          <Text variant="body2" style={s.mb}>
            {
              t('incident.reportedBy', {
                createdAt: new Date(data.incident!.createdAt),
              }) as string
            }
            <Text variant="link" onPress={onUserOwnerClick}>
              {INCIDENT_OWNER_USER_NAME}
            </Text>
          </Text>
          <Text variant="subheader" style={s.mb}>
            {FORMATTED_ADDRESS}
          </Text>
          <Text variant="body">
            {
              t('incident.distanceToUser', {
                segment: [data.incident!.location, userLocation],
              }) as string
            }
          </Text>
          <Text variant="body">
            {
              t('incident.amountOfPeopleNotified', {
                count: data.incident!.usersNotifiedCount,
              }) as string
            }
          </Text>
        </View>
      </ScrollView>
      <View style={[s.buttonsContainer, { paddingRight: insets.right, paddingTop: insets.top }]}>
        <FloatingButton icon="Close" onPress={onClosePressed} />
      </View>
      <View style={[{ paddingBottom: insets.bottom }, s.bottomContainer]}>
        <IconWithLabel
          label={t('formatters.bigNumber', { number: REACTIONS_COUNT }) as string}
          size="xl"
          icon={'Likes'} // TODO: Like button
          style={s.actionIcon}
        />
        <IconWithLabel
          label={t('formatters.bigNumber', { number: REPLIES_COUNT }) as string}
          size="xl"
          icon={'MessageCircle'}
          style={s.actionIcon}
          onPress={onCommentsPressed}
        />
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  scrollableContainer: {
    flex: 1,
  },
  contentContainer: {
    margin: spacing.l,
  },
  rowSpaceBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    color: colors.textLighter,
    marginTop: spacing.m,
  },
  actionIcon: {
    // backgroundColor: colors.transparentBackground,
  },
  buttonsContainer: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  mb: {
    marginBottom: spacing.xl,
  },
}))

function IncidentDetailContainer() {
  const { params } = useRoute<MainStackRouteProp<'IncidentDetail'>>()
  const [preloadedQueryRef, loadQuery] =
    useQueryLoader<IncidentDetailQueryType>(IncidentDetailQuery)

  useEffect(() => {
    console.log('IncidentDetail', params.incidentId)
    loadQuery({ incidentId: params.incidentId })
  }, [loadQuery, params.incidentId])

  if (!preloadedQueryRef) return null
  return (
    <Suspense fallback={<Loading />}>
      <IncidentDetail preloadedQueryRef={preloadedQueryRef} />
    </Suspense>
  )
}

export { IncidentDetailContainer as IncidentDetail }
