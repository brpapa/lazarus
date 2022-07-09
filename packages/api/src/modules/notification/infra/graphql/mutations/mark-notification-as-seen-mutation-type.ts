import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { markNotificationAsSeenCommand } from 'src/modules/notification/application/commands'
import {
  Input,
  NotificationNotFound,
  Res,
} from 'src/modules/notification/application/commands/mark-notification-as-seen-command'
import { GetNotificationById } from 'src/modules/notification/application/queries/get-notification-by-id'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { UnauthorizedError } from 'src/modules/shared/logic/errors'
import { NotificationType } from '../types/notification-type'

export const MarkNotificationAsSeenMutationType = createResultMutationType<
  GraphQLContext,
  Input,
  Res
>({
  name: 'MarkNotificationAsSeen',
  description: 'Mark notification as seen by the target user',
  inputFields: {
    notificationId: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: (input, ctx) => markNotificationAsSeenCommand.exec(input, ctx),
  okFields: {
    notification: {
      type: GraphQLNonNull(NotificationType),
      resolve: (res, _, ctx) => GetNotificationById.gen(res.asOk(), ctx),
    },
  },
  errors: [NotificationNotFound, UnauthorizedError],
})
