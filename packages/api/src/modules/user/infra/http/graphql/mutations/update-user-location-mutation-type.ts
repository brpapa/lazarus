import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { updateUserLocationCommand } from 'src/modules/user/application/commands'
import {
  UpdateUserLocationInput,
  UpdateUserLocationResult,
} from 'src/modules/user/application/commands/update-user-location-command'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'
import { LocationInputType } from 'src/shared/infra/graphql/types/location-type'
import { UserType } from '../types/user-type'
import { GetUserById } from '../../../../application/queries/get-user-by-id'

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
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
