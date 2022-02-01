import { markNotificationAsSeenCommand } from 'src/modules/notification/application/commands'
import {
  NotificationNotFound,
  Input,
  Res,
  UnauthorizedError,
} from 'src/modules/notification/application/commands/mark-notification-as-seen-command'
import { GetNotificationById } from 'src/modules/notification/application/queries/get-notification-by-id'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationType } from '../types/notification-type'

export const MarkNotificationAsSeenMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'MarkNotificationAsSeen',
  description: 'Mark notification as seen by the target user',
  inputFields: {
    notificationId: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: (input, ctx) => markNotificationAsSeenCommand.exec(input, ctx),
  resultFields: {
    ok: {
      notification: {
        type: GraphQLNonNull(NotificationType),
        resolve: (res, _, ctx) => GetNotificationById.gen(res.asOk(), ctx),
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
            name: 'MarkNotificationAsSeenErrCodeType',
            values: {
              [NotificationNotFound.name]: { value: NotificationNotFound.name },
              [UnauthorizedError.name]: { value: UnauthorizedError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
