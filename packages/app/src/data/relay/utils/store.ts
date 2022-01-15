import { ConnectionHandler, RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime'

export const appendIncidentToConnection = (
  store: RecordSourceSelectorProxy,
  incidentRecord: RecordProxy,
) => {
  // get the connection record
  const rootRecord = store.getRoot() // relative to all store
  const connectionKey = 'IncidentMarkerList_incidents'
  const connectionRecord = ConnectionHandler.getConnection(rootRecord, connectionKey)
  if (!connectionRecord)
    throw new Error(`Not found connection record in root with key: ${connectionKey}`)

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
