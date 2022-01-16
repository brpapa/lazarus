import { graphql } from 'react-relay'
import type { CapturedPicture } from '~/containers/Camera'
import { appendIncidentToConnection } from '~/data/relay/utils/store'
import { uploadPictures } from '~/screens/ReportScreen/upload-pictures'
import type {
  ReportIncidentErrCodeType,
  ReportIncidentInput as RawReportIncidentInput,
  ReportIncidentMutation as ReportIncidentMutationType
} from '~/__generated__/ReportIncidentMutation.graphql'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'

type ReportIncidentInput = Omit<RawReportIncidentInput, 'medias'> & {
  pictures: CapturedPicture[]
}
type ReportIncidentOkResult = {}
type ReportIncidentErrResult = { reason: string; code: ReportIncidentErrCodeType }

export const useReportIncidentMutation = createResultMutationHook<
  ReportIncidentMutationType,
  ReportIncidentInput,
  ReportIncidentOkResult,
  ReportIncidentErrResult
>({
  mutationName: 'reportIncident',
  resultTypenamePreffix: 'ReportIncident',
  // REBEMBER THAT THE MUTATION PAYLOAD QUERY ABOVE SHOULD CONTAINS ALL FIELDS AVAILABLE IN SCHEMA DUE TO UPDATER IMPLEMENTATION BELOW THAT APPENDS INCIDENT TO CONNECTION
  mutation: graphql`
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
  `,
  inputMapper: async (input): Promise<RawReportIncidentInput> => {
    const uploadResults = await uploadPictures(input.pictures)

    const mutationInput = {
      ...input,
      pictures: undefined,
      medias: uploadResults.map((r) => ({ url: r.s3Url })),
    }

    return mutationInput
  },
  updater: (store) => {
    const payloadRecord = store.getRootField('reportIncident') // relative to this mutation only
    const resultRecord = payloadRecord.getLinkedRecord('result')

    // abort store update if is an err result
    if (resultRecord.getValue('__typename') === 'ReportIncidentErrResult') return

    // get the incident record created by mutation
    const incidentRecord = resultRecord.getLinkedRecord('incident')
    if (!incidentRecord) throw new Error('Not found reportIncident.incident record')

    appendIncidentToConnection(store, incidentRecord)
  },
})
