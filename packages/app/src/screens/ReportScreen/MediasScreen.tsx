import { t } from '@metis/shared'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Image } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CloseIcon } from '~/assets/icons'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import MyButton from '~/components/MyButton'
import { useReportIncidentMutation } from '~/data/relay/mutations/ReportIncidentMutation'
import { useSession } from '~/hooks/use-session'
import type { ReportStackParams } from '.'

export default function MediasScreen() {
  const insets = useSafeAreaInsets()
  const reportNavigation = useNavigation<StackNavigationProp<ReportStackParams, 'Medias'>>()
  const { params } = useRoute<RouteProp<ReportStackParams, 'Medias'>>()

  const [title, setTitle] = useState('')

  const backToCamera = useCallback(() => {
    reportNavigation.replace('Camera', { previousCapturedPictures: params.capturedPictures })
  }, [params.capturedPictures, reportNavigation])

  const closeReport = useCallback(() => {
    reportNavigation.popToTop()
    reportNavigation.goBack()
  }, [reportNavigation])

  const [reportIncident, isSending] = useReportIncidentMutation()
  const { closeSession } = useSession()

  const onReportButtonPressed = useCallback(async () => {
    const result = await reportIncident({
      title: title,
      pictures: params.capturedPictures,
    })

    result.map(
      () => closeReport(),
      (err) => {
        if (err.code === 'UnauthenticatedError') closeSession()
      },
    )
  }, [closeReport, closeSession, params.capturedPictures, reportIncident, title])

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        {params.capturedPictures.map((media, i) => (
          <Image
            key={i}
            source={{ uri: media.uri }}
            style={{ width: '100%', height: 400 }}
            resizeMode="cover"
          />
        ))}

        <Text variant="link" onPress={backToCamera}>
          Adicionar outra midia
        </Text>

        <Text variant="header" m="md">
          {t('report.title')}
        </Text>

        <TextInput
          style={{ padding: 15, height: 50, fontSize: 24 }}
          value={title}
          placeholder={'Digite um título para o alerta'}
          onChangeText={(value) => setTitle(value)}
          onSubmitEditing={() => {
            if (!title) return // Don't submit if empty
            setTitle('')
          }}
        />
      </ScrollView>
      <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
        <MyButton my={'sm'} icon={CloseIcon} onPress={closeReport} />
      </Box>
      <Box
        flexGrow={1}
        bg="background"
        mx="sm"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <MyButton
          p="sm"
          mx="sm"
          my="md"
          label={t('report.reportButton')}
          onPress={onReportButtonPressed}
          isLoading={isSending}
        />
      </Box>
    </Box>
  )
}

// example react native vision camera
/*
const isVideoOnLoadEvent = (
  event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>,
): event is OnLoadData => 'duration' in event && 'naturalSize' in event

type Props = NativeStackScreenProps<Routes, 'MediaPage'>

export function MediaPage({ navigation, route }: Props): React.ReactElement {
  const { path, type } = route.params
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false)
  const isForeground = useIsForeground()
  const isScreenFocused = useIsFocused()
  const isVideoPaused = !isForeground || !isScreenFocused
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none')

  const onClosePressed = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const onMediaLoad = useCallback(
    (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
      if (isVideoOnLoadEvent(event)) {
        console.log(
          `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`,
        )
      } else {
        console.log(
          `Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`,
        )
      }
    },
    [],
  )
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.')
    setHasMediaLoaded(true)
  }, [])
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`)
  }, [])

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving')

      // TODO: upload
      
      setSavingState('saved')
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e)
      setSavingState('none')
      Alert.alert(
        'Failed to save!',
        `An unexpected error occured while trying to save your ${type}. ${message}`,
      )
    }
  }, [path, type])

  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded])

  return (
    <View style={[styles.container, screenStyle]}>
      {type === 'photo' && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoadEnd={onMediaLoadEnd}
          onLoad={onMediaLoad}
        />
      )}
      {type === 'video' && (
        <Video
          source={source}
          style={StyleSheet.absoluteFill}
          paused={isVideoPaused}
          resizeMode="cover"
          posterResizeMode="cover"
          allowsExternalPlayback={false}
          automaticallyWaitsToMinimizeStalling={false}
          disableFocus={true}
          repeat={true}
          useTextureView={false}
          controls={false}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          onReadyForDisplay={onMediaLoadEnd}
          onLoad={onMediaLoad}
          onError={onMediaLoadError}
        />
      )}

      <PressableOpacity style={styles.closeButton} onPress={onClosePressed}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </PressableOpacity>

      <PressableOpacity
        style={styles.saveButton}
        onPress={onSavePressed}
        disabled={savingState !== 'none'}
      >
        {savingState === 'none' && (
          <IonIcon name="download" size={35} color="white" style={styles.icon} />
        )}
        {savingState === 'saved' && (
          <IonIcon name="checkmark" size={35} color="white" style={styles.icon} />
        )}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </PressableOpacity>

      <StatusBarBlurBackground />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
})
*/
