import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  Input,
  InvalidMediaQuantityError,
  Res,
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { UnauthenticatedError } from 'src/modules/shared/logic/errors'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'ReportIncident',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    medias: { type: GraphQLNonNull(GraphQLList(MediaInputType)) },
  },
  mutateAndGetResult: (input, ctx) => reportIncidentCommand.exec(input, ctx),
  resultFields: {
    ok: {
      incident: {
        type: GraphQLNonNull(IncidentType),
        resolve: (res, _, ctx) => GetIncidentById.gen(res.asOk(), ctx),
      },
    },
    err: {
      reason: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asErr().reason,
      },
      reasonIsTranslated: {
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: (res) => res.asErr().reasonIsTranslated,
      },
      code: {
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: 'ReportIncidentErrCodeType',
            values: {
              [UnauthenticatedError.name]: { value: UnauthenticatedError.name },
              [InvalidMediaQuantityError.name]: { value: InvalidMediaQuantityError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
