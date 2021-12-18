import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  ReportIncidentInput,
  ReportIncidentOkOutput,
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createMutation } from 'src/shared/infra/graphql/create-mutation'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate-type'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createMutation<
  GraphQLContext,
  ReportIncidentInput,
  ReportIncidentOkOutput
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
    return incident.value
  },
  outputFields: {
    incident: {
      type: IncidentType,
      resolve: (payload, _, ctx) => GetIncidentById.gen(payload, ctx),
    },
  },
})
