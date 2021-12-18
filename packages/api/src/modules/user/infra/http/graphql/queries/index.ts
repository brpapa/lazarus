export {}

// import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLFieldConfig } from 'graphql'
// import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay'
// import { GraphQLContext } from 'src/infra/http/graphql/context'
// import { UserType, UserConnectionType } from 'src/modules/user/infra/http/graphql/types/user'

// export const userQueriesFields: Record<string, GraphQLFieldConfig<void, GraphQLContext>> = {
//   me: {
//     type: UserType,
//     description: 'The current logged user',
//     resolve: (_, args, ctx) => {
//       if (ctx.viewer) UserLoader.load(ctx, ctx.viewer._id)
//     },
//   },
//   user: {
//     type: UserType,
//     args: {
//       id: {
//         type: GraphQLNonNull(GraphQLID),
//       },
//     },
//     resolve: (_, args, ctx) => {
//       const { id } = fromGlobalId(args.id)
//       return IncidentService.getOne(args.id, ctx)
//     },
//   },
//   users: {
//     type: UserConnectionType,
//     args: {
//       ...connectionArgs,
//       search: {
//         type: GraphQLString,
//         description: 'Name of user to search by',
//       },
//     },
//     resolve: (_, args: UserArgs, ctx) => {
//       return UserLoader.loadMany(ctx, args)
//     },
//   },
// }

// type UserArgs = ConnectionArguments & {
//   search?: string
// }
