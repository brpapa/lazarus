import { markNotificationAsSeenCommand } from '@notification/application/commands'
import {
  NotificationNotFound,
  Input,
  Res,
  UnauthorizedError,
} from '@notification/application/commands/mark-notification-as-seen-command'
import { GetNotificationById } from '@notification/application/queries/get-notification-by-id'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationType } from '../types/notification-type'

export const MarkNotificationAsSeenMutation = createMutationType<GraphQLContext, Input, Res>({
  name: 'MarkNotificationAsSeen',
  description: 'Mark notification as seen by the target user',
  inputFields: {
    notificationId: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: (input, ctx) => markNotificationAsSeenCommand.exec(input, ctx),
  okResultFields: {
    notification: {
      type: GraphQLNonNull(NotificationType),
      resolve: (result, _, ctx) => GetNotificationById.gen(result.asOk(), ctx),
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
          name: 'MarkNotificationAsSeenErrCodeType',
          values: {
            [NotificationNotFound.name]: { value: NotificationNotFound.name },
            [UnauthorizedError.name]: { value: UnauthorizedError.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
