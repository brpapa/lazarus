import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { GraphQLTypes, NodeInterfaceType } from 'src/api/graphql/node'
import { IncidentConnectionDTO, IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { connectionDefinitions } from 'src/modules/shared/infra/graphql/connections'
import { DateScalarType } from 'src/modules/shared/infra/graphql/types/date-scalar-type'
import { LocationType } from 'src/modules/shared/infra/graphql/types/location-type'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { UserType } from 'src/modules/user/infra/graphql/types/user-type'
import { MediaType } from './media-type'

const INCIDENT_TYPE_NAME = 'Incident'

export const IncidentType = GraphQLTypes.register(
  new GraphQLObjectType<IncidentDTO, GraphQLContext>({
    name: INCIDENT_TYPE_NAME,
    interfaces: [NodeInterfaceType], // this type implements the Node GraphQL interface
    fields: () => ({
      id: {
        ...globalIdField(INCIDENT_TYPE_NAME, (incident) => incident.incidentId),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      incidentId: {
        resolve: (incident) => incident.incidentId,
        type: GraphQLNonNull(GraphQLString),
      },
      title: {
        resolve: (incident) => incident.title,
        type: GraphQLNonNull(GraphQLString),
      },
      location: {
        resolve: (incident) => incident.location,
        type: GraphQLNonNull(LocationType),
      },
      formattedAddress: {
        resolve: (incident) => incident.formattedAddress,
        type: GraphQLString,
      },
      medias: {
        resolve: (incident) => incident.medias,
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MediaType))),
      },
      usersNotifiedCount: {
        resolve: (incident) => incident.usersNotifiedCount,
        type: GraphQLNonNull(GraphQLInt),
      },
      ownerUser: {
        resolve: (incident, _, ctx) => GetUserById.gen({ userId: incident.ownerUserId }, ctx),
        type: GraphQLNonNull(UserType),
      },
      createdAt: {
        resolve: (incident) => incident.createdAt,
        type: GraphQLNonNull(DateScalarType),
      },
    }),
  }),
)

export const { connectionType: IncidentConnectionType, edgeType: IncidentEdgeType } =
  connectionDefinitions({
    name: INCIDENT_TYPE_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(IncidentType),
    connectionFields: () => ({
      totalCount: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'Total count of incidents',
        resolve: (c: IncidentConnectionDTO) => c.totalCount,
      },
    }),
  })
