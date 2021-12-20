import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { reportIncidentCommand } from 'src/modules/incident/application/commands'
import {
  ReportIncidentInput, ReportIncidentResult
} from 'src/modules/incident/application/commands/report-incident-command'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate-type'
import { BusinessError, DomainError, UnauthenticatedError } from 'src/shared/logic/errors'
import { IncidentType } from '../types/incident-type'
import { MediaInputType } from '../types/media-type'

export const ReportIncidentMutationType = createMutationType<
  GraphQLContext,
  ReportIncidentInput,
  ReportIncidentResult
>({
  name: 'ReportIncident',
  inputFields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    coordinate: { type: GraphQLNonNull(CoordinateInputType) },
    medias: { type: GraphQLNonNull(GraphQLList(MediaInputType)) },
  },
  mutateAndGetResult: (input, ctx) => reportIncidentCommand.exec(input, ctx),
  okResultFields: {
    incident: {
      type: GraphQLNonNull(IncidentType),
      resolve: (result: ReportIncidentResult, _, ctx) => GetIncidentById.gen(result.asOk(), ctx),
    },
  },
  errResultFields: {
    reason: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asErr().reason,
    },
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'ReportIncidentErrCodeType',
          values: {
            UNAUTHENTICATED_ERROR: { value: 'UNAUTHENTICATED_ERROR' },
            DOMAIN_ERROR: { value: 'DOMAIN_ERROR' },
            BUSINESS_ERROR: { value: 'BUSINESS_ERROR' },
          },
        }),
      ),
      resolve: (result) => {
        const err = result.asErr()
        if (err instanceof UnauthenticatedError) return 'UNAUTHENTICATED_ERROR'
        if (err instanceof DomainError) return 'DOMAIN_ERROR'
        if (err instanceof BusinessError) return 'BUSINESS_ERROR'
        throw new Error('Err is instance of an unexpected class')
      },
    },
  },
})
