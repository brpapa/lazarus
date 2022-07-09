import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  Input,
  InvalidMediaQuantityError,
  Res,
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'ReportIncident',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    medias: { type: GraphQLNonNull(GraphQLList(MediaInputType)) },
  },
  mutateAndGetResult: (input, ctx) => reportIncidentCommand.exec(input, ctx),
  okFields: {
    incident: {
      type: GraphQLNonNull(IncidentType),
      resolve: (res, _, ctx) => GetIncidentById.gen(res.asOk(), ctx),
    },
  },
  errors: [UnauthenticatedError, InvalidMediaQuantityError],
})
