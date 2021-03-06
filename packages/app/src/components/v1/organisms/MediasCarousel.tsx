import Carousel from 'pinar'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { MediaTypeEnum } from '~/shared/constants'
import { makeUseStyles } from '~/theme/v1'
import type { Media } from '~/types'
import { VideoPlayer } from './VideoPlayer'

type MediasCarousel = {
  medias?: Media[]
  height: number
  autoplay?: boolean
}

export function MediasCarousel(props: MediasCarousel) {
  const { medias = [], height, autoplay = false } = props

  const s = useStyles()

  return (
    <View style={[{ height }]}>
      <Carousel style={{ flex: 1 }} showsControls={false} loop={true} index={0} autoplay={autoplay}>
        {medias.length > 0 ? (
          medias.map((media, key) => <Slide key={key} media={media} height={height} />)
        ) : (
          <View style={[s.media, { height }]} />
        )}
      </Carousel>
    </View>
  )
}

function Slide(props: { media: Media; height: number }) {
  const { media, height } = props
  const s = useStyles()

  switch (media.type) {
    case MediaTypeEnum.IMAGE:
      return <Image source={{ uri: media.uri }} style={[s.media, s.image, { height }]} />
    case MediaTypeEnum.VIDEO:
      return (
        <VideoPlayer
          videoProps={{
            source: { uri: media.uri },
          }}
          style={StyleSheet.flatten([s.media, s.video, { height }])}
        />
      )
    default:
      throw new Error(`Unexpected media type: ${media.type}`)
  }
}

const useStyles = makeUseStyles(({ colors }) => ({
  container: {
    flex: 1,
  },
  media: {
    backgroundColor: colors.backgroundDarker,
  },
  image: {},
  video: {},
}))
