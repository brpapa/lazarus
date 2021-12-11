import { GraphQLContext } from 'src/infra/http/graphql/context'
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from 'src/shared/infra/graphql/connections'
import { GraphQLTypes, nodeInterface } from 'src/infra/http/graphql/node'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { DateType } from 'src/shared/infra/graphql/types/date'
import { CoordinateType } from 'src/shared/infra/graphql/types/coordinate'
import { MediaType } from './media'

export const IncidentType = GraphQLTypes.register(
  new GraphQLObjectType<IncidentDTO, GraphQLContext>({
    name: 'Incident',
    interfaces: [nodeInterface], // this type implements the Node GraphQL interface
    fields: () => ({
      id: globalIdField('Incident'), // the opaque identifier of this node, from relay specs
      incidentId: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The incident id',
        resolve: (incident) => incident.id,
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
        type: GraphQLNonNull(GraphQLList(MediaType)),
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
    name: 'Incident',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(IncidentType),
  })
