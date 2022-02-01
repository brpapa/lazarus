import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { LocationInputType } from 'src/modules/shared/infra/graphql/types/location-type'
import { updateUserLocationCommand } from 'src/modules/user/application/commands'
import { Input, Res } from 'src/modules/user/application/commands/update-user-location-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { UnauthenticatedError, UserNotFoundError } from 'src/modules/shared/logic/errors'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserType } from '../types/user-type'

export const UpdateUserLocationMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'UpdateUserLocation',
  description: 'Update the current location of the authenticated user',
  inputFields: {
    location: { type: GraphQLNonNull(LocationInputType) },
  },
  mutateAndGetResult: async (args, ctx) => updateUserLocationCommand.exec(args, ctx),
  resultFields: {
    ok: {
      user: {
        type: GraphQLNonNull(UserType),
        resolve: (res, _, ctx) => GetUserById.gen(res.asOk(), ctx),
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
            name: 'UpdateUserLocationErrCodeType',
            values: {
              [UnauthenticatedError.name]: { value: UnauthenticatedError.name },
              [UserNotFoundError.name]: { value: UserNotFoundError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
