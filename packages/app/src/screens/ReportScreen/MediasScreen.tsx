import React, { useCallback, useState } from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import type { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import FormData from 'form-data'
import Box from '~/components/atomics/Box'
import RoundedButton from '~/components/RoundedButton'
import intl from '~/shared/intl'
import Text from '~/components/atomics/Text'
import { useRecoilValue } from 'recoil'
import type { ReportStackParams } from '.'
import { SERVER_BASE_URL } from '~/shared/config'
import { graphql, useMutation } from 'react-relay'
import { userCoordinateState } from '~/data/recoil'

// TODO: retornar s3 url de cada media
const uploadMedias = async (medias: { uri: string }[]) => {
  const form = medias.reduce<FormData>((form, media, idx) => {
    const imageKey = `image-${idx}`
    form.append(imageKey, {
      uri: media.uri,
      name: imageKey,
      type: 'image/jpeg',
    })
    return form
  }, new FormData())

  const response = await fetch(`${SERVER_BASE_URL}/uploads`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: form,
  })
  const bodyRes = await response.json()
  console.log('uploaded to the server, response: ' + JSON.stringify(bodyRes))
  return [] as string[]
}

export default function MediasScreen() {
  const reportNavigation = useNavigation<StackNavigationProp<ReportStackParams, 'Medias'>>()
  const { params } = useRoute<RouteProp<ReportStackParams, 'Medias'>>()
  const userCoordinate = useRecoilValue(userCoordinateState)

  const insets = useSafeAreaInsets()
  const [title, setTitle] = useState('')

  const [commit, isInFlight] = useMutation(graphql`
    mutation MediasMutation($input: CreateIncidentInput!) {
      createIncident(input: $input) {
        clientMutationId
        incident {
          incidentId
          title
        }
      }
    }
  `)

  const onPublish = useCallback(async () => {
    // if (title === '') return
    if (params.capturedMedias.length === 0) return

    const s3Urls = await uploadMedias(params.capturedMedias)

    commit({
      variables: {
        input: {
          userId: 'user-id',
          title: title,
          coordinate: userCoordinate,
          medias: s3Urls.map((url) => ({ url })),
        },
      },
      onCompleted: (response, errors) => {
        console.log('response: ')
        console.log(response)
        reportNavigation.popToTop()
      },
    })
  }, [commit])

  const backToCamera = useCallback(() => {
    reportNavigation.replace('Camera', { previousCapturedMedias: params.capturedMedias })
  }, [params.capturedMedias, reportNavigation])

  if (isInFlight) return <Text>Sending</Text>

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9, marginTop: insets.top }}>
        <Text variant="link" onPress={backToCamera}>
          Adicionar outra midia
        </Text>

        {params.capturedMedias.map((media, i) => (
          <Image
            key={i}
            source={{ uri: media.uri }}
            style={{ width: '100%', height: 400 }}
            resizeMode="cover"
          />
        ))}

        <Text variant="header" m="md">
          {intl.publishIncident}
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
      <Box
        flexGrow={1}
        bg="background"
        mx="sm"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <RoundedButton p="sm" mx="sm" my="md" label={intl.report} onPress={onPublish} />
      </Box>
    </Box>
  )
}

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
