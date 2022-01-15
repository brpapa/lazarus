import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { connectionDefinitions } from '@shared/infra/graphql/connections'
import { DateType } from '@shared/infra/graphql/types/date-type'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
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
        ...globalIdField(NOTIFICATION_TYPE_NAME, (n) => n.notificationId),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      notificationId: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (n) => n.notificationId,
      },
      targetUserId: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (n) => n.targetUserId,
      },
      code: {
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: 'NotificationCodeEnum',
            values: mapObjectValues(NotificationCodeEnum, (v) => ({ value: v })),
          }),
        ),
        resolve: (n) => n.code,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (n) => n.title,
      },
      subtitle: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (n) => n.subtitle,
      },
      body: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (n) => n.body,
      },
      link: {
        type: GraphQLNonNull(NotificationLinkType),
        resolve: (n) => n.link,
      },
      seenByTargetUser: {
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: (n) => n.seenByTargetUser,
      },
      createdAt: {
        type: GraphQLNonNull(DateType),
        resolve: (n) => n.createdAt,
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
    connectionFields: () => ({
      totalCount: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'Total count of notifications of user',
        resolve: (c) => c.totalCount,
      },
      notSeenCount: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'Count of notifications not seen by user yet',
        resolve: (c) => c.notSeenCount,
      },
    }),
  })
