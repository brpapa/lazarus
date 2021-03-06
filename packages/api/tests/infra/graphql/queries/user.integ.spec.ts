import request from 'supertest'
import { app } from 'src/api/http/app'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'

describe('graphql query: user', () => {
  beforeAll(connectDataSources)
  beforeEach(cleanUpDatasources)
  afterAll(disconnectDatasources)

  test.skip('it should get an user', async () => {
    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query: `{
          user {
            id
            _id
            name
            email
          }
        }`,
        variables: null,
      })
      .expect(200)

    console.log(response.body)
  })
  test.todo('it should')
})

/*
test('should not show email of other users', async () => {
  const userA = await createRows.createUser()
  const userB = await createRows.createUser()

  // language=GraphQL
  const query = `
    query Q {
      users(first: 2) {
        edges {
          node {
            _id
            name
            email
            active
          }
        }
      }
    }
  `

  const rootValue = {}
  const context = getContext({ user: userA })

  const result = await graphql(schema, query, rootValue, context)
  const { edges } = result.data.users

  expect(edges[0].node.name).toBe(userB.name)
  expect(edges[0].node.email).toBe(null)

  expect(edges[1].node.name).toBe(userA.name)
  expect(edges[1].node.email).toBe(userA.email)
})

test('should return the current user when user is logged in', async () => {
  const user = await createRows.createUser()

  const query = `
    query Q {
      me {
        id
        name
        email
      }
    }
  `

  const rootValue = {}
  const context = getContext({ user })

  const result = await graphql(schema, query, rootValue, context)
  const { data } = result

  expect(data.me.name).toBe(user.name)
  expect(data.me.email).toBe(user.email)
})

test('should return a user by global id', async () => {
  const user = await createRows.createUser()

  const query = `
    query Q($id: ID!) {
      user(id: $id) {
        id
        name
        email
        active
      }
    }
  `

  const rootValue = {}
  const context = getContext({ user })
  const variables = {
    id: toGlobalId('User', user.id),
  }

  const result = await graphql(schema, query, rootValue, context, variables)
  const { data } = result

  expect(data.user.name).toBe(user.name)
  expect(data.user.email).toBe(user.email)
  expect(data.user.active).toBe(user.active)
})

test('should return a user with id and email null', async () => {
  const user = await createRows.createUser()

  const query = `
    query Q($id: ID!) {
      user(id: $id) {
        id
        name
        email
        active
      }
    }
  `

  const rootValue = {}
  // can only see email and active status if user is in context
  const context = getContext()
  const variables = {
    id: toGlobalId('User', user.id),
  }

  console.log('context')
  console.log(context)
  const result = await graphql(schema, query, rootValue, context, variables)
  const { data } = result

  expect(data.user.name).toBe(user.name)
  expect(data.user.email).toBe(null)
  expect(data.user.active).toBe(null)
})
*/
