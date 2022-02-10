import { GraphQLNonNull } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { LocationInputType } from 'src/modules/shared/infra/graphql/types/location-type'
import { UnauthenticatedError, UserNotFoundError } from 'src/modules/shared/logic/errors'
import { updateUserLocationCommand } from 'src/modules/user/application/commands'
import { Input, Res } from 'src/modules/user/application/commands/update-user-location-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { UserType } from '../types/user-type'

export const UpdateUserLocationMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'UpdateUserLocation',
  description: 'Update the current location of the authenticated user',
  inputFields: {
    location: { type: GraphQLNonNull(LocationInputType) },
  },
  mutateAndGetResult: async (args, ctx) => updateUserLocationCommand.exec(args, ctx),
  okFields: {
    user: {
      type: GraphQLNonNull(UserType),
      resolve: (res, _, ctx) => GetUserById.gen(res.asOk(), ctx),
    },
  },
  errors: [UnauthenticatedError, UserNotFoundError],
})
