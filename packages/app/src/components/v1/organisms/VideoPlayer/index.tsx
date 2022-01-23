import { Audio, AVPlaybackStatus, Video } from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, View } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { ControlStates, ErrorSeverity, PlaybackStates } from './constants'
import { defaultProps, VideoPlayerProps } from './props'
import { deepMerge, ErrorMessage, styles } from './utils'

// example with custom videoplayer controls: code ~/dev/@clones/expo-video-player
export function VideoPlayer(tempProps: VideoPlayerProps) {
  const props = deepMerge(defaultProps, tempProps) as VideoPlayerProps

  let playbackInstance: Video | null = null
  let controlsTimer: NodeJS.Timeout | null = null
  let initialShow = props.defaultControlsVisible

  const [errorMessage, setErrorMessage] = useState('')
  const controlsOpacity = useRef(new Animated.Value(props.defaultControlsVisible ? 1 : 0)).current
  const [controlsState, setControlsState] = useState(
    props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden,
  )
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: props.videoProps.source ? PlaybackStates.Loading : PlaybackStates.Error,
  })

  const screenRatio = props.style.width! / props.style.height!

  let videoHeight = props.style.height
  let videoWidth = videoHeight! * screenRatio

  if (videoWidth > props.style.width!) {
    videoWidth = props.style.width!
    videoHeight = videoWidth / screenRatio
  }

  useEffect(() => {
    setAudio()

    return () => {
      if (playbackInstance) {
        playbackInstance.setStatusAsync({
          shouldPlay: false,
        })
      }
    }
  }, [])

  useEffect(() => {
    if (!props.videoProps.source) {
      console.error(
        '[VideoPlayer] `Source` is a required in `videoProps`. ' +
          'Check https://docs.expo.io/versions/latest/sdk/video/#usage',
      )
      setErrorMessage('`Source` is a required in `videoProps`')
      setPlaybackInstanceInfo({ ...playbackInstanceInfo, state: PlaybackStates.Error })
    } else {
      setPlaybackInstanceInfo({ ...playbackInstanceInfo, state: PlaybackStates.Playing })
    }
  }, [props.videoProps.source])

  const hideAnimation = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: props.animation.fadeOutDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setControlsState(ControlStates.Hidden)
      }
    })
  }

  const animationToggle = () => {
    if (controlsState === ControlStates.Hidden) {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: props.animation.fadeInDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setControlsState(ControlStates.Visible)
        }
      })
    } else if (controlsState === ControlStates.Visible) {
      hideAnimation()
    }

    if (controlsTimer === null && props.autoHidePlayer) {
      controlsTimer = setTimeout(() => {
        if (
          playbackInstanceInfo.state === PlaybackStates.Playing &&
          controlsState === ControlStates.Hidden
        ) {
          hideAnimation()
        }
        if (controlsTimer) {
          clearTimeout(controlsTimer)
        }
        controlsTimer = null
      }, 2000)
    }
  }

  // Set audio mode to play even in silent mode (like the YouTube app)
  const setAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      })
    } catch (e) {
      props.errorCallback({
        type: ErrorSeverity.NonFatal,
        message: 'Audio.setAudioModeAsync',
        obj: e as Record<string, unknown>,
      })
    }
  }

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    props.playbackCallback(status)

    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? PlaybackStates.Ended
          : status.isBuffering
          ? PlaybackStates.Buffering
          : status.shouldPlay
          ? PlaybackStates.Playing
          : PlaybackStates.Paused,
      })
      if (
        (status.didJustFinish && controlsState === ControlStates.Hidden) ||
        (status.isBuffering && controlsState === ControlStates.Hidden && initialShow)
      ) {
        animationToggle()
        initialShow = false
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`
        setErrorMessage(errorMsg)
        props.errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} })
      }
    }
  }

  if (playbackInstanceInfo.state === PlaybackStates.Error) {
    return (
      <View
        style={{
          backgroundColor: props.style.videoBackgroundColor,
          width: videoWidth,
          height: videoHeight,
        }}
      >
        <ErrorMessage style={props.textStyle} message={errorMessage} />
      </View>
    )
  }

  if (playbackInstanceInfo.state === PlaybackStates.Loading) {
    return (
      <View
        style={{
          backgroundColor: props.style.controlsBackgroundColor,
          width: videoWidth,
          height: videoHeight,
          justifyContent: 'center',
        }}
      >
        {<ActivityIndicator {...props.activityIndicator} />}
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      style={{
        backgroundColor: props.style.videoBackgroundColor,
        width: videoWidth,
        height: videoHeight,
        maxWidth: '100%',
      }}
      onPress={() => {
        if (playbackInstanceInfo.state === PlaybackStates.Playing) {
          playbackInstance?.pauseAsync()
        } else {
          playbackInstance?.playAsync()
        }
      }}
    >
      <Video
        style={styles.videoWrapper}
        shouldPlay={false}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        isLooping={true}
        useNativeControls={false}
        {...props.videoProps}
        ref={(component) => {
          playbackInstance = component
          if (props.videoProps.ref) {
            props.videoProps.ref.current = component as Video
          }
        }}
        onPlaybackStatusUpdate={updatePlaybackCallback}
      />
    </TouchableWithoutFeedback>
  )
}

VideoPlayer.defaultProps = defaultProps
