import { useCallback } from 'react'
import { graphql, useMutation } from 'react-relay'
import type { CapturedPicture } from '~/containers/Camera'
import { appendIncidentToConnection } from '~/data/relay/store-utils'
import { uploadPictures } from '~/screens/ReportScreen/upload-pictures'
import type {
  ReportIncidentErrCodeType,
  ReportIncidentInput,
  ReportIncidentMutation as ReportIncidentMutationType
} from '~/__generated__/ReportIncidentMutation.graphql'

// REBEMBER THAT THE MUTATION PAYLOAD QUERY ABOVE SHOULD CONTAINS ALL FIELDS AVAILABLE IN SCHEMA TO AVOID FUTURE ERRORS, BECAUSE OF MY UPDATER IMPLEMENTATION BELOW
const mutation = graphql`
  mutation ReportIncidentMutation($input: ReportIncidentInput!) {
    reportIncident(input: $input) {
      result {
        __typename
        ... on ReportIncidentOkResult {
          incident {
            id
            incidentId
            title
            location {
              latitude
              longitude
            }
            medias {
              url
            }
            createdAt
          }
        }
        ... on ReportIncidentErrResult {
          reason
          code
        }
      }
    }
  }
`

type Input = Omit<ReportIncidentInput, 'medias'> & {
  pictures: CapturedPicture[]
}
type Listeners = {
  onOkResult?: () => void
  onErrResult?: (result: { reason: string; code: ReportIncidentErrCodeType }) => void
}

export const useReportIncidentMutation = () => {
  const [commit, isSending] = useMutation<ReportIncidentMutationType>(mutation)

  const reportIncident = useCallback(
    async (input: Input, listeners?: Listeners) => {
      if (input.pictures.length === 0) return

      const uploadResults = await uploadPictures(input.pictures)

      const mutationInput = {
        ...input,
        pictures: undefined,
        medias: uploadResults.map((r) => ({ url: r.s3Url })),
      }
      return commit({
        variables: { input: mutationInput },
        onCompleted: (response, errors) => {
          // request completes successfully
          if (errors !== null) throw new Error(`Unexpected error: ${JSON.stringify(errors)}`)

          const result = response.reportIncident.result

          switch (result.__typename) {
            case 'ReportIncidentOkResult':
              return listeners?.onOkResult && listeners.onOkResult()
            case 'ReportIncidentErrResult':
              return listeners?.onErrResult && listeners.onErrResult(result)
            default:
              throw new Error(`Unexpected result typename: ${result.__typename}`)
          }
        },
        updater: (store) => {
          // define how update the relay store after a successfull response

          const payloadRecord = store.getRootField('reportIncident') // relative to this mutation only
          const resultRecord = payloadRecord.getLinkedRecord('result')

          // abort store update if is an err result
          if (resultRecord.getValue('__typename') === 'ReportIncidentErrResult') return

          // get the incident record created by mutation
          const incidentRecord = resultRecord.getLinkedRecord('incident')
          if (!incidentRecord)
            throw new Error('Not found reportIncident.incident record in mutation payload')
          
          appendIncidentToConnection(store, incidentRecord)
        },
        onError: (error) => {
          // onError is called when:
          // Server errors (5xx HTTP codes, 1xxx WebSocket codes)
          // Client problems e.g. rate-limited, unauthorized, etc. (4xx HTTP codes)
          // The query is missing/malformed
          // The query fails GraphQL internal validation (syntax, schema logic, etc.)
          throw error
        },
        // if was passed a optimisticResponse/optimisticUpdater but the query fails, they are automacally rollbacked.
      })
    },
    [commit],
  )

  return [reportIncident, isSending] as const
}
