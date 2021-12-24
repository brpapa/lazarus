import { beforeAll, beforeEach, afterAll, it, expect } from '@jest/globals'
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { schema } from '../../../../src/infra/graphql/schema'

// beforeAll(connectMongoose)

// beforeEach(clearDbAndRestartCounters)

// afterAll(disconnectMongoose)

// it('should load User', async () => {
//   const user = await createRows.createUser()

//   // language=GraphQL
//   const query = `
//     query Q($id: ID!) {
//       node(id: $id) {
//         id
//         ... on User {
//           name
//         }
//       }
//     }
//   `

//   const rootValue = {}
//   // @ts-ignore
//   const ctx = getContext()
//   const variables = {
//     id: toGlobalId('User', user.id),
//   }

//   const result = await graphql(schema, query, rootValue, ctx, variables)
//   expect(result.data?.node.id).toBe(variables.id)
//   expect(result.data?.node.name).toBe(user.name)
// })

export {}
