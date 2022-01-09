import { GraphQLContext } from 'src/api/graphql/context'
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from 'src/modules/shared/infra/graphql/connections'
import { GraphQLTypes, NodeInterfaceType } from 'src/api/graphql/node'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { DateType } from 'src/modules/shared/infra/graphql/types/date-type'
import { LocationType } from 'src/modules/shared/infra/graphql/types/location-type'
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
        type: GraphQLNonNull(GraphQLString),
        resolve: (incident) => incident.incidentId,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (incident) => incident.title,
      },
      location: {
        type: GraphQLNonNull(LocationType),
        resolve: (incident) => incident.location,
      },
      formattedAddress: {
        type: GraphQLString,
        resolve: (incident) => incident.formattedAddress,
      },
      medias: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MediaType))),
        resolve: (incident) => incident.medias,
      },
      usersNotified: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (incident) => incident.usersNotified,
      },
      createdAt: {
        type: GraphQLNonNull(DateType),
        resolve: (incident) => incident.createdAt,
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
  })
