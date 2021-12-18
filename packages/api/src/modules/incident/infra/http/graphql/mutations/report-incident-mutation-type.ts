import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import { ReportIncidentInput } from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createMutationWithClientMutationId } from 'src/shared/infra/graphql/create-mutation'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate-type'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'
import { ReportIncidentOkOutput } from './../../../../application/commands/report-incident-command'

export const ReportIncidentMutationType = createMutationWithClientMutationId<
  GraphQLContext,
  ReportIncidentInput,
  { incidentId: string }
>({
  name: 'ReportIncident',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    coordinate: { type: GraphQLNonNull(CoordinateInputType) },
    medias: { type: GraphQLNonNull(GraphQLList(MediaInputType)) },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const incident = await reportIncidentCommand.exec(args, ctx)
    if (incident.isErr()) throw incident.error
    return { incidentId: incident.value.id }
  },
  outputFields: {
    incident: {
      type: IncidentType,
      resolve: (payload, _, ctx) => {
        return GetIncidentById.gen({ id: payload.incidentId }, ctx)
      },
    },
  },
})
