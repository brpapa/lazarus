import { seeNotificationCommand } from '@notification/application/commands'
import {
  NotificationNotFound,
  SeeNotificationInput,
  SeeNotificationResult,
} from '@notification/application/commands/see-notification-command'
import { GetNotificationById } from '@notification/application/queries/get-notification-by-id'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationType } from '../types/notification-type'

export const SeeNotificationMutationType = createMutationType<
  GraphQLContext,
  SeeNotificationInput,
  SeeNotificationResult
>({
  name: 'SeeNotification',
  description: 'Mark notification as seen by target user',
  inputFields: {
    notificationId: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: (input, ctx) => seeNotificationCommand.exec(input, ctx),
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
          name: 'SeeNotificationErrCodeType',
          values: {
            [NotificationNotFound.name]: { value: NotificationNotFound.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
