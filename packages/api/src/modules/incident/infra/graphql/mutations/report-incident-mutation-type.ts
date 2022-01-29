import { reportIncidentCommand } from '@incident/application/commands'
import {
  InvalidMediaQuantityError,
  Input,
  Res,
} from '@incident/application/commands/report-incident-command'
import { GetIncidentById } from '@incident/application/queries'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createMutationType<GraphQLContext, Input, Res>({
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
    reasonIsTranslated: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (result) => result.asErr().reasonIsTranslated,
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
      resolve: (result) => result.asErr().code,
    },
  },
})
