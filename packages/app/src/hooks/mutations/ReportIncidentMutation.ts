import { useCallback } from 'react'
import { ConnectionHandler, graphql, useMutation } from 'react-relay'
import type { CapturedPicture } from '~/containers/Camera'
import { uploadPictures } from '~/screens/ReportScreen/upload-pictures'
import type {
  ReportIncidentInput,
  ReportIncidentMutation as ReportIncidentMutationType,
} from '~/__generated__/useReportIncidentMutation.graphql'

const mutation = graphql`
  mutation ReportIncidentMutation($input: ReportIncidentInput!) {
    reportIncident(input: $input) {
      incident {
        id
        incidentId
        title
        coordinate {
          latitude
          longitude
        }
        medias {
          url
        }
        createdAt
      }
    }
  }
`

type Input = Omit<ReportIncidentInput, 'medias'> & {
  pictures: CapturedPicture[]
}

export const useReportIncidentMutation = () => {
  const [commit] = useMutation<ReportIncidentMutationType>(mutation)

  const reportIncident = useCallback(
    async (input: Input) => {
      if (input.pictures.length === 0) return

      const uploadResults = await uploadPictures(input.pictures)

      const mutationInput = {
        ...input,
        pictures: undefined,
        medias: uploadResults.map((r) => ({ url: r.s3Url })),
      }
      return commit({
        variables: { input: mutationInput },
        // request completes successfully
        onCompleted: (response, errors) => {
          // errors exists when:
          // An uncaught developer error occurred inside the resolve/subscribe function (e.g. poorly written database query)
          // console.log(response, errors)
          // TODO: add errors to data payload when (business errors)
          // The user-supplied variables or context is bad and the resolve/subscribe function intentionally throws an error (e.g. not allowed to view requested user)
        },
        // onError is called when:
        // Server errors (5xx HTTP codes, 1xxx WebSocket codes)
        // Client problems e.g. rate-limited, unauthorized, etc. (4xx HTTP codes)
        // The query is missing/malformed
        // The query fails GraphQL internal validation (syntax, schema logic, etc.)
        onError: console.error,
        // define how update the local store after a successfull response
        updater: (store) => {
          // get the connection record
          const rootRecord = store.getRoot() // relative to all store
          const connectionKey = 'IncidentMarkers_incidents'
          const connectionRecord = ConnectionHandler.getConnection(rootRecord, connectionKey)
          if (!connectionRecord)
            throw new Error(`Not found connection record from root with key: ${connectionKey}`)

          // get the recently created incident record
          const incidentRecord = store
            .getRootField('reportIncident') // relative to mutation response/payload
            ?.getLinkedRecord('incident')
          if (!incidentRecord) throw new Error('Not found reportIncident.incident record from mutation payload')

          // create a new edge record
          const newEdgeRecord = ConnectionHandler.createEdge(
            store,
            connectionRecord,
            incidentRecord, // the node record of the creating edge
            'IncidentEdge', // graphql type of edge record
          )

          // add the new edge record to the end of the connection record
          ConnectionHandler.insertEdgeAfter(connectionRecord, newEdgeRecord)
        },
      })
    },
    [commit],
  )

  return [reportIncident]
}
