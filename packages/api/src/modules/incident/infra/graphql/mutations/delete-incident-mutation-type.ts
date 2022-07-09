import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { deleteIncidentCommand } from 'src/modules/incident/application/commands'
import {
  IncidentNotFound,
  Input,
  Res,
} from 'src/modules/incident/application/commands/delete-incident-command'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { UnauthenticatedError, UnauthorizedError } from 'src/modules/shared/logic/errors'

export const DeleteIncidentMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'DeleteIncident',
  inputFields: {
    incidentId: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: (input, ctx) => deleteIncidentCommand.exec(input, ctx),
  okFields: {},
  errors: [UnauthenticatedError, IncidentNotFound, UnauthorizedError],
})
