import { GraphQLList, GraphQLNonNull } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { markAllNotificationsAsSeenCommand } from 'src/modules/notification/application/commands'
import {
  Input,
  Res,
} from 'src/modules/notification/application/commands/mark-all-notifications-as-seen-command'
import { GetNotificationById } from 'src/modules/notification/application/queries/get-notification-by-id'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
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
  okFields: {
    notifications: {
      type: GraphQLNonNull(GraphQLList(NotificationType)),
      resolve: (res, _, ctx) => res.asOk().map((n) => GetNotificationById.gen(n, ctx)),
    },
  },
  errors: [UnauthenticatedError],
})
