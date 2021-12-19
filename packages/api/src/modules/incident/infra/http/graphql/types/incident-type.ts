import { GraphQLContext } from 'src/infra/http/graphql/context'
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from 'src/shared/infra/graphql/connections'
import { GraphQLTypes, nodeInterface } from 'src/infra/http/graphql/node'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { DateType } from 'src/shared/infra/graphql/types/date-type'
import { CoordinateType } from 'src/shared/infra/graphql/types/coordinate-type'
import { MediaType } from './media-type'

const INCIDENT_TYPE_NAME = 'Incident'

export const IncidentType = GraphQLTypes.register(
  new GraphQLObjectType<IncidentDTO, GraphQLContext>({
    name: INCIDENT_TYPE_NAME,
    interfaces: [nodeInterface], // this type implements the Node GraphQL interface
    fields: () => ({
      id: {
        ...globalIdField(INCIDENT_TYPE_NAME, (incident) => incident.incidentId),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      incidentId: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The incident id',
        resolve: (incident) => incident.incidentId,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (incident) => incident.title,
      },
      coordinate: {
        type: GraphQLNonNull(CoordinateType),
        resolve: (incident) => incident.coordinate,
      },
      medias: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MediaType))),
        resolve: (incident) => incident.medias,
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
