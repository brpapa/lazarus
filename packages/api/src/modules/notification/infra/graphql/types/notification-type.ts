import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { connectionDefinitions } from '@shared/infra/graphql/connections'
import { DateType } from '@shared/infra/graphql/types/date-type'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { globalIdField } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { GraphQLTypes, NodeInterfaceType } from 'src/api/graphql/node'
import { NotificationCodeEnum } from 'src/modules/notification/domain/models/notification'
import { LinkedEntityEnum } from 'src/modules/notification/domain/models/notification-link'
import { mapObjectValues } from 'src/modules/shared/logic/helpers/map-object-values'

const NotificationLinkType = new GraphQLObjectType<NotificationDTO['link']>({
  name: 'NotificationLink',
  fields: () => ({
    entity: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'LinkedEntityEnum',
          values: mapObjectValues(LinkedEntityEnum, (v) => ({ value: v })),
        }),
      ),
      resolve: (link) => link.entity,
    },
    entityId: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (link) => link.entityId,
    },
  }),
})

const NOTIFICATION_TYPE_NAME = 'Notification'

export const NotificationType = GraphQLTypes.register(
  new GraphQLObjectType<NotificationDTO, GraphQLContext>({
    name: NOTIFICATION_TYPE_NAME,
    interfaces: [NodeInterfaceType], // this type implements the Node GraphQL interface
    fields: () => ({
      id: {
        ...globalIdField(NOTIFICATION_TYPE_NAME, (notification) => notification.notificationId),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      notificationId: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (notification) => notification.notificationId,
      },
      targetUserId: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (notification) => notification.targetUserId,
      },
      code: {
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: 'NotificationCodeEnum',
            values: mapObjectValues(NotificationCodeEnum, (v) => ({ value: v })),
          }),
        ),
        resolve: (notification) => notification.code,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (notification) => notification.title,
      },
      subtitle: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (notification) => notification.subtitle,
      },
      body: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (notification) => notification.body,
      },
      link: {
        type: GraphQLNonNull(NotificationLinkType),
        resolve: (notification) => notification.link,
      },
      seenByTargetUser: {
        type: GraphQLBoolean,
        resolve: (notification) => notification.seenByTargetUser,
      },
      createdAt: {
        type: GraphQLNonNull(DateType),
        resolve: (notification) => notification.createdAt,
      },
    }),
  }),
)

export const { connectionType: NotificationConnectionType, edgeType: NotificationEdgeType } =
  connectionDefinitions({
    name: NOTIFICATION_TYPE_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(NotificationType),
  })
