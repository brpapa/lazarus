import { t } from '@lazarus/shared'
import { useNavigation, useRoute } from '@react-navigation/core'
import { default as React, Suspense, useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay'
import { useRecoilValue } from 'recoil'
import { FloatingButton, IconWithLabel, Loading, MediasCarousel, Text } from '~/components/v1'
import { userLocationState } from '~/data/recoil'
import type { MainStackNavProp, MainStackRouteProp } from '~/navigation/types'
import { MediaTypeEnum, SCREEN_HEIGHT } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { IncidentDetailQuery as IncidentDetailQueryType } from '~/__generated__/IncidentDetailQuery.graphql'
import IncidentDetailQuery from '~/__generated__/IncidentDetailQuery.graphql'

// TODO: [backend] incident.stats
const REPLIES_COUNT = 0
const REACTIONS_COUNT = 0

const query = graphql`
  query IncidentDetailQuery($incidentId: String!) {
    incident(incidentId: $incidentId) {
      incidentId
      title
      medias {
        url
        type
      }
      location {
        latitude
        longitude
      }
      ownerUser {
        userId
        name
      }
      formattedAddress
      usersNotifiedCount
      createdAt
    }
  }
`

type Props = {
  preloadedQueryRef: PreloadedQuery<IncidentDetailQueryType>
}

function IncidentDetail(props: Props) {
  const nav = useNavigation<MainStackNavProp<'IncidentDetail'>>()
  const { params } = useRoute<MainStackRouteProp<'IncidentDetail'>>()
  const insets = useSafeAreaInsets()

  const s = useStyles()
  const data = usePreloadedQuery<IncidentDetailQueryType>(query, props.preloadedQueryRef)
  const userLocation = useRecoilValue(userLocationState)

  const onCommentsPressed = () => {
    nav.navigate('IncidentComments', { incidentId: params.incidentId })
  }
  const onClosePressed = () => {
    // must be nav.reset because a push notification click can direct to this screen
    nav.reset({
      index: 0,
      routes: [{ name: 'HomeTabNavigator' }],
    })
  }
  const onUserOwnerClick = () => {
    console.log(data?.incident?.ownerUser?.userId)
    // TODO: go to user screen passing data?.incident?.ownerUser?.userId
  }

  return (
    <View style={s.container}>
      <ScrollView style={s.scrollableContainer}>
        <MediasCarousel
          medias={
            data.incident?.medias.map(({ url, type }) => ({
              uri: url,
              type: MediaTypeEnum[type as 'IMAGE' | 'VIDEO'],
            })) ?? []
          }
          height={SCREEN_HEIGHT(insets) * 0.65}
        />
        <View style={s.contentContainer}>
          <Text variant="header">{data.incident?.title}</Text>
          <Text variant="body2" style={s.mb}>
            {
              t('incident.reportedBy', {
                createdAt: new Date(data.incident!.createdAt),
              }) as string
            }
            <Text variant="link" onPress={onUserOwnerClick}>
              {data.incident?.ownerUser.name}
            </Text>
          </Text>
          <Text variant="subheader" style={s.mb}>
            {data.incident?.formattedAddress ?? undefined}
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
      <View style={s.buttonsContainer}>
        <FloatingButton icon="Close" onPress={onClosePressed} />
      </View>
      {/* <View style={s.bottomContainer}>
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
      </View> */}
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing, insets }) => ({
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
    paddingBottom: insets.bottom,
  },
  actionIcon: {
    // backgroundColor: colors.transparentBackground,
  },
  buttonsContainer: {
    position: 'absolute',
    right: 15,
    top: 10,
    paddingRight: insets.right,
    paddingTop: insets.top,
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
