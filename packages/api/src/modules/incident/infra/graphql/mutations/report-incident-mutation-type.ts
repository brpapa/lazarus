import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  ReportIncidentInput,
  ReportIncidentResult,
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
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
      resolve: (result, _, ctx) => GetIncidentById.gen(result.asOk(), ctx),
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
            InvalidMediaQuantityError: { value: 'InvalidMediaQuantityError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
