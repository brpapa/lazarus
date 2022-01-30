import type { Camera } from 'expo-camera'
import React, { useCallback, useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import {
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler'
import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { CAPTURE_BUTTON_SIZE } from '~/shared/constants'
import { getStartRecording, getTakePicture } from './camera-wrappers'

const START_RECORDING_DELAY = 100
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1

interface Props extends ViewProps {
  cameraRef: React.RefObject<Camera>
  onMediaCaptured: (media: CapturedMedia) => void
  enabled: boolean
}

// based on this example with reanimated: /Users/bruno.papa/dev/@clones/react-native-vision-camera/example/src/views/CaptureButton.tsx
const _CaptureButton = ({ cameraRef, onMediaCaptured, enabled, style, ...props }: Props) => {
  const pressDownDate = useRef<Date | undefined>(undefined)
  const isRecording = useRef(false)
  const recordingProgress = useSharedValue(0)
  const isPressingButton = useSharedValue(false)

  // #region Camera Capture
  const onStoppedRecording = useCallback(() => {
    isRecording.current = false
    cancelAnimation(recordingProgress)
    console.log('stopped recording video')
  }, [recordingProgress])

  const takePhoto = useCallback(async () => {
    try {
      const takePicture = getTakePicture.bind(this, cameraRef?.current)()

      console.log('Taking picture...')
      const image = await takePicture()
      onMediaCaptured(image)
    } catch (e) {
      console.error('Failed to take photo', e)
    }
  }, [cameraRef, onMediaCaptured])

  const startRecording = useCallback(() => {
    try {
      const startRecording = getStartRecording.bind(this, cameraRef?.current)()

      console.log('calling startRecording...')
      startRecording()
        .then((video) => {
          console.log(`Recording successfully finished! ${video.uri}`)
          onMediaCaptured(video)
          onStoppedRecording()
        })
        .catch((error) => {
          console.error('Recording failed', error)
          onStoppedRecording()
        })

      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log('called startRecording')
      isRecording.current = true
    } catch (e) {
      console.error('failed to start recording', e, 'camera')
    }
  }, [cameraRef, onMediaCaptured, onStoppedRecording])

  const stopRecording = useCallback(() => {
    try {
      console.log('calling stopRecording...')
      cameraRef.current?.stopRecording()
      console.log('called stopRecording')
    } catch (e) {
      console.error('failed to stop recording', e)
    }
  }, [cameraRef])

  // #endregion

  // #region Animated Style
  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton],
  )

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        )
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        })
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      })
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    }
  }, [enabled, isPressingButton])
  // #endregion

  //#region Tap handler
  const tapHandler = useRef<TapGestureHandler>()
  const onHandlerStateChanged = useCallback(
    async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
      // This is the gesture handler for the circular "shutter" button.
      // Once the finger touches the button (State.BEGAN), a photo is being taken and "capture mode" is entered. (disabled tab bar)
      // Also, we set `pressDownDate` to the time of the press down event, and start a 200ms timeout. If the `pressDownDate` hasn't changed
      // after the 200ms, the user is still holding down the "shutter" button. In that case, we start recording.
      //
      // Once the finger releases the button (State.END/FAILED/CANCELLED), we leave "capture mode" (enable tab bar) and check the `pressDownDate`,
      // if `pressDownDate` was less than 200ms ago, we know that the intention of the user is to take a photo. We check the `takePhotoPromise` if
      // there already is an ongoing (or already resolved) takePhoto() call (remember that we called takePhoto() when the user pressed down), and
      // if yes, use that. If no, we just try calling takePhoto() again
      console.debug(`state: ${Object.keys(State)[event.state]}`)
      switch (event.state) {
        case State.BEGAN: {
          // enter "recording mode"
          recordingProgress.value = 0
          isPressingButton.value = true
          const now = new Date()
          pressDownDate.current = now
          setTimeout(() => {
            if (pressDownDate.current === now) {
              // user is still pressing down after 200ms, so his intention is to create a video
              startRecording()
            }
          }, START_RECORDING_DELAY)
          return
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          // exit "recording mode"
          try {
            if (pressDownDate.current == null)
              throw new Error('PressDownDate ref .current was null!')
            const now = new Date()
            const diff = now.getTime() - pressDownDate.current.getTime()
            pressDownDate.current = undefined
            if (diff < START_RECORDING_DELAY) {
              // user has released the button within 200ms, so his intention is to take a single picture.
              await takePhoto()
            } else {
              // user has held the button for more than 200ms, so he has been recording this entire time.
              stopRecording()
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false
            }, 500)
          }
          return
        }
        default:
          break
      }
    },
    [isPressingButton, recordingProgress, startRecording, stopRecording, takePhoto],
  )
  //#endregion

  return (
    <TapGestureHandler
      enabled={enabled}
      ref={tapHandler}
      onHandlerStateChange={onHandlerStateChanged}
      shouldCancelWhenOutside={false}
      maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside of the child view (to zoom)
    >
      <Reanimated.View {...props} style={[buttonStyle, style]}>
        <Reanimated.View style={styles.flex}>
          <Reanimated.View style={[styles.shadow, shadowStyle]} />
          <View style={styles.button} />
        </Reanimated.View>
      </Reanimated.View>
    </TapGestureHandler>
  )
}

export const CaptureButton = React.memo(_CaptureButton)

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
})
