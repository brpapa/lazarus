import {
  Input,
  Res,
} from 'src/modules/notification/application/commands/mark-all-notifications-as-seen-command'
import { GetNotificationById } from 'src/modules/notification/application/queries/get-notification-by-id'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { markAllNotificationsAsSeenCommand } from 'src/modules/notification/application/commands'
import { UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { NotificationType } from '../types/notification-type'

export const MarkAllNotificationsAsSeenMutationType = createResultMutationType<
  GraphQLContext,
  Input,
  Res
>({
  name: 'MarkAllNotificationsAsSeen',
  description: 'Mark all notifications of requester user as seen',
  inputFields: {},
  mutateAndGetResult: (input, ctx) => markAllNotificationsAsSeenCommand.exec(input, ctx),
  resultFields: {
    ok: {
      notifications: {
        type: GraphQLNonNull(GraphQLList(NotificationType)),
        resolve: (res, _, ctx) => res.asOk().map((n) => GetNotificationById.gen(n, ctx)),
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
            name: 'MarkAllNotificationsAsSeenErrCodeType',
            values: {
              [UnauthenticatedError.name]: { value: UnauthenticatedError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
