import { graphql } from 'react-relay'
import { appendIncidentToConnection } from '~/data/relay/utils/store'
import { uploadMedias } from '~/data/upload-medias'
import type { CapturedMedia } from '~/types'
import type {
  ReportIncidentErrCodeType,
  ReportIncidentInput as RawReportIncidentInput,
  ReportIncidentMutation as ReportIncidentMutationType,
} from '~/__generated__/ReportIncidentMutation.graphql'
import { createResultMutationHook } from '../utils/create-result-mutation-hook'
import type { ErrResult } from '../utils/types'

// REBEMBER THAT THE MUTATION PAYLOAD QUERY ABOVE SHOULD CONTAINS ALL FIELDS AVAILABLE IN SCHEMA DUE TO UPDATER IMPLEMENTATION BELOW THAT APPENDS INCIDENT TO CONNECTION
const mutation = graphql`
  mutation ReportIncidentMutation($input: ReportIncidentInput!) {
    reportIncident(input: $input) {
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
        reasonIsTranslated
        code
      }
    }
  }
`

type ReportIncidentInput = Omit<RawReportIncidentInput, 'medias'> & {
  medias: CapturedMedia[]
}
type ReportIncidentOkResult = {}
type ReportIncidentErrResult = ErrResult<ReportIncidentErrCodeType>

export const useReportIncidentMutation = createResultMutationHook<
  ReportIncidentMutationType,
  ReportIncidentInput,
  ReportIncidentOkResult,
  ReportIncidentErrResult
>({
  mutationName: 'reportIncident',
  resultTypenamePreffix: 'ReportIncident',
  mutation,
  inputMapper: async (input): Promise<RawReportIncidentInput> => {
    const uploadedMediasById = await uploadMedias(input.medias)

    const medias = input.medias.map((media) => {
      const uploaded = uploadedMediasById[media.id]
      if (!uploaded) throw new Error(`Media ${media.id} not found in API return`)

      return {
        type: media.type,
        url: uploaded.s3Url,
      }
    })

    return {
      title: input.title,
      medias,
    }
  },
  updater: (store) => {
    const resultRecord = store.getRootField('reportIncident') // relative to this mutation only

    // abort store update if is an err result
    if (resultRecord.getValue('__typename') === 'ReportIncidentErrResult') return

    // get the incident record created by mutation
    const incidentRecord = resultRecord.getLinkedRecord('incident')
    if (!incidentRecord) throw new Error('Not found reportIncident.incident record')

    appendIncidentToConnection(store, incidentRecord)
  },
})
