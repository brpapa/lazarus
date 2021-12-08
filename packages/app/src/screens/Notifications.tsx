import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from '~/components/atomics'

const notifications = [
  { id: '0', text: 'View' },
  { id: '1', text: 'Text' },
  { id: '2', text: 'Image' },
  { id: '3', text: 'ScrollView' },
  { id: '4', text: 'ListView' },
]

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Top text</Text>
      <YStack bg='$bg4' width={100} height={100} space='$10'>
        <Text>oi</Text>
        <Text>blz</Text>
      </YStack>
      <FlatList
        style={styles.container}
        data={notifications}
        renderItem={({ item: notification }) => <Text style={styles.row}>{notification.text}</Text>}
        keyExtractor={({ id }) => id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
})
