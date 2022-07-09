import React from 'react'
import { Modal, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import CachedImage from './CachedImage'
import { makeUseStyles } from '~/theme/v1'

type Props = {
  visible: boolean
  uri: string
  onPressCancel: () => void
}

export function ImageModal(props: Props) {
  const styles = useStyles()

  const { visible: show, uri, onPressCancel } = props

  return (
    <Modal
      visible={show}
      presentationStyle="overFullScreen"
      transparent
      statusBarTranslucent
      onRequestClose={onPressCancel}
    >
      <View style={styles.modalContainer}>
        <StatusBar style={'light'} />
        <CachedImage
          isBackground
          source={{ uri }}
          style={styles.imageDetail}
          visible={show}
          setVisible={onPressCancel}
        />
      </View>
    </Modal>
  )
}

const useStyles = makeUseStyles(() => ({
  modalContainer: {
    flexGrow: 1,
  },
  imageDetail: {
    flexGrow: 1,
  },
}))
