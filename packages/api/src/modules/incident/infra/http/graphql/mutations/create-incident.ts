import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { MediaDTO } from 'src/modules/incident/adapter/dtos/media'
import { createIncidentCommand } from 'src/modules/incident/application/commands'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { CoordinateDTO } from 'src/shared/adapter/dtos/coordinate'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate'
import { IncidentType } from '../types/incident'
import { MediaInputType } from '../types/media'

// create a mutation based on relay specs: https://github.com/graphql/graphql-relay-js#mutations
export const CreateIncidentMutationType: GraphQLFieldConfig<any, GraphQLContext> =
  mutationWithClientMutationId({
    name: 'CreateIncident',
    inputFields: {
      userId: {
        type: GraphQLNonNull(GraphQLString),
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
      },
      coordinate: {
        type: GraphQLNonNull(CoordinateInputType),
      },
      medias: {
        type: GraphQLNonNull(GraphQLList(MediaInputType)),
      },
    },
    mutateAndGetPayload: async (args: {
      userId: string
      title: string
      coordinate: CoordinateDTO
      medias: MediaDTO[]
    }) => {
      const incident = await createIncidentCommand.exec({
        userId: args.userId,
        title: args.title,
        coordinate: args.coordinate,
        medias: args.medias.map((media) => ({
          url: media.url,
          type: MediaType.PHOTO, // TODO
          recordedAt: new Date(), // TODO
        })),
      })
      if (incident.isErr()) throw incident.error
      return { incidentId: incident.value.id }
    },
    outputFields: {
      incident: {
        type: IncidentType,
        resolve: (payload, _, ctx) => GetIncidentById.gen({ id: payload.incidentId }, ctx),
      },
    },
  })
