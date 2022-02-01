import { t } from '@metis/shared'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { Text } from '~/components/v1'
import { HeaderItem, ModalHeader } from '~/components/v1'
import type { RootStackNavProp, RootStackRouteProp } from '~/navigation/types'
import { makeUseStyles, useTheme } from '~/theme/v1'

const incidentComments = [{ content: 'teste 1' }, { content: 'test 2 ' }]

export function IncidentComments() {
  const s = useStyles()
  const { colors } = useTheme()

  const nav = useNavigation<RootStackNavProp<'IncidentComments'>>()
  const { params } = useRoute<RootStackRouteProp<'IncidentComments'>>()

  return (
    <SafeAreaView style={s.container}>
      <ModalHeader
        title={t('Comments')}
        left={<HeaderItem label={t('Cancel')} onPressItem={nav.goBack} left />}
      />
      {/* <VirtualizedList
        data={incidentComments}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        getItem={getItem}
        getItemCount={getItemCount}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onEndReached={loadMore}
        ListFooterComponent={<FooterLoadingIndicator isHidden={!isLoadMore} />}
        style={s.notificationContainer}
      /> */}
    </SafeAreaView>
  )
}

const useStyles = makeUseStyles(({ colors, fontVariants, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notificationContainer: {
    flex: 1,
    width: '100%',
  },
  androidModalContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalButtonContainer: {
    paddingLeft: spacing.xl,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.pureWhite,
  },
  modalText: {
    paddingVertical: spacing.xl,
  },
}))
