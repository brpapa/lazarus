import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceProxy,
  RecordSourceSelectorProxy,
} from 'relay-runtime'

export const appendIncidentToConnection = (
  store: RecordSourceSelectorProxy,
  incidentRecord: RecordProxy,
) => {
  // get the connection record
  const rootRecord = store.getRoot() // relative to all store
  const connectionKey = 'IncidentMarkerList_incidents'
  const connectionRecord = ConnectionHandler.getConnection(rootRecord, connectionKey)
  if (!connectionRecord) throw new Error(`Not found root.${connectionKey} connection record`)

  // create a new edge record
  const newEdgeRecord = ConnectionHandler.createEdge(
    store,
    connectionRecord,
    incidentRecord, // the node record of the creating edge
    'IncidentEdge', // graphql type of edge record
  )

  // add the new edge record to the end of the connection record
  ConnectionHandler.insertEdgeAfter(connectionRecord, newEdgeRecord)
}

export const updateProfileTabBarBadgeValue = (
  store: RecordSourceProxy,
  operation: {
    type: 'INCREMENT' | 'SET'
    value: number
  },
) => {
  const notificationsRecord = store
    .getRoot()
    ?.getLinkedRecord('me')
    ?.getLinkedRecord('notifications')
  if (!notificationsRecord) throw new Error('Not found root.me.notifications record')

  const notSeenCount = notificationsRecord.getValue('notSeenCount')
  if (typeof notSeenCount !== 'number')
    throw new Error('Value of root.me.notifications.notSeenCount scalar is not a number')

  const newValue = operation.type === 'INCREMENT' ? notSeenCount + operation.value : operation.value
  notificationsRecord.setValue(newValue, 'notSeenCount')
}
