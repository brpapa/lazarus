import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  ReportIncidentInput,
  ReportIncidentResult
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createMutationType<
  GraphQLContext,
  ReportIncidentInput,
  ReportIncidentResult
>({
  name: 'ReportIncident',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    medias: { type: GraphQLNonNull(GraphQLList(MediaInputType)) },
  },
  mutateAndGetResult: (input, ctx) => reportIncidentCommand.exec(input, ctx),
  okResultFields: {
    incident: {
      type: GraphQLNonNull(IncidentType),
      resolve: (result: ReportIncidentResult, _, ctx) => GetIncidentById.gen(result.asOk(), ctx),
    },
  },
  errResultFields: {
    reason: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asErr().reason,
    },
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'ReportIncidentErrCodeType',
          values: {
            UnauthenticatedError: { value: 'UnauthenticatedError' },
            MediaQuantityError: { value: 'MediaQuantityError' },
            InvalidLocationError: { value: 'InvalidLocationError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
