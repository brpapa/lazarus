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
import {
  NotificationConnectionDTO,
  NotificationDTO,
} from 'src/modules/notification/adapter/dtos/notification-dto'
import { NotificationCodeEnum } from 'src/modules/notification/domain/models/notification'
import { LinkedEntityEnum } from 'src/modules/notification/domain/models/notification-link'
import { connectionDefinitions } from 'src/modules/shared/infra/graphql/connections'
import { DateType } from 'src/modules/shared/infra/graphql/types/date-type'
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
        resolve: (n) => n.notificationId,
        type: GraphQLNonNull(GraphQLString),
      },
      targetUserId: {
        resolve: (n) => n.targetUserId,
        type: GraphQLNonNull(GraphQLString),
      },
      code: {
        resolve: (n) => n.code,
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: 'NotificationCodeEnum',
            values: mapObjectValues(NotificationCodeEnum, (v) => ({ value: v })),
          }),
        ),
      },
      title: {
        resolve: (n) => n.title,
        type: GraphQLNonNull(GraphQLString),
      },
      subtitle: {
        resolve: (n) => n.subtitle,
        type: GraphQLNonNull(GraphQLString),
      },
      body: {
        resolve: (n) => n.body,
        type: GraphQLNonNull(GraphQLString),
      },
      link: {
        resolve: (n) => n.link,
        type: GraphQLNonNull(NotificationLinkType),
      },
      seenByTargetUser: {
        resolve: (n) => n.seenByTargetUser,
        type: GraphQLNonNull(GraphQLBoolean),
      },
      createdAt: {
        resolve: (n) => n.createdAt,
        type: GraphQLNonNull(DateType),
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
        resolve: (c: NotificationConnectionDTO) => c.totalCount,
      },
      notSeenCount: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'Count of not seen notifications of user',
        resolve: (c: NotificationConnectionDTO) => c.notSeenCount,
      },
    }),
  })
