import Carousel from 'pinar'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { VideoPlayer } from '~/components/v1/organisms'
import { SCREEN_HEIGHT } from '~/config'
import { MediaType } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'

type MediasCarousel = {
  medias?: Media[]
}

export function MediasCarousel(props: MediasCarousel) {
  const { medias = [] } = props

  const s = useStyles()

  return (
    <Carousel style={s.container} showsControls={false} loop={true} index={0}>
      {medias.length > 0 ? (
        medias.map((media, key) => <Slide key={key} media={media} />)
      ) : (
        <View style={s.media} />
      )}
    </Carousel>
  )
}

function Slide(props: { media: Media }) {
  const s = useStyles()

  switch (props.media.type) {
    case MediaType.IMAGE:
      return <Image source={{ uri: props.media.uri }} style={[s.media, s.image]} />
    case MediaType.VIDEO:
      return (
        <VideoPlayer
          videoProps={{
            source: { uri: props.media.uri },
          }}
          style={StyleSheet.flatten([s.media, s.video])}
        />
      )
    default:
      throw new Error(`Unexpected media type: ${props.media.type}`)
  }
}

const useStyles = makeUseStyles(({ colors }) => ({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.65,
  },
  media: {
    backgroundColor: colors.backgroundDarker,
    height: SCREEN_HEIGHT * 0.65,
  },
  image: {},
  video: {},
}))
