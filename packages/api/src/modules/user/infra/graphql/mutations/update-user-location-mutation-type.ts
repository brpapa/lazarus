import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { updateUserLocationCommand } from 'src/modules/user/application/commands'
import {
  UpdateUserLocationInput,
  UpdateUserLocationResult,
} from 'src/modules/user/application/commands/update-user-location-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { createMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { LocationInputType } from 'src/modules/shared/infra/graphql/types/location-type'
import { UserType } from '../types/user-type'

export const UpdateUserLocationMutationType = createMutationType<
  GraphQLContext,
  UpdateUserLocationInput,
  UpdateUserLocationResult
>({
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
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'UpdateUserLocationErrCodeType',
          values: {
            UnauthenticatedError: { value: 'UnauthenticatedError' },
            InvalidLocationError: { value: 'InvalidLocationError' },
            UserNotFoundError: { value: 'UserNotFoundError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
