import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { LocationInputType } from '@shared/infra/graphql/types/location-type'
import { updateUserLocationCommand } from '@user/application/commands'
import { Input, Res } from '@user/application/commands/update-user-location-command'
import { GetUserById } from '@user/application/queries/get-user-by-id'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { UnauthenticatedError, UserNotFoundError } from 'src/modules/shared/logic/errors'
import { UserType } from '../types/user-type'

export const UpdateUserLocationMutationType = createMutationType<GraphQLContext, Input, Res>({
  name: 'UpdateUserLocation',
  description: 'Update the current location of the authenticated user',
  inputFields: {
    location: { type: GraphQLNonNull(LocationInputType) },
  },
  mutateAndGetResult: async (args, ctx) => updateUserLocationCommand.exec(args, ctx),
  okResultFields: {
    user: {
      type: GraphQLNonNull(UserType),
      resolve: (result, _, ctx) => GetUserById.gen(result.asOk(), ctx),
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
          name: 'UpdateUserLocationErrCodeType',
          values: {
            [UnauthenticatedError.name]: { value: UnauthenticatedError.name },
            [UserNotFoundError.name]: { value: UserNotFoundError.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
