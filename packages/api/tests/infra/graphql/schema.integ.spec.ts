// @ts-ignore
import { introspectionQuery } from 'graphql/utilities'
import { graphql, graphqlSync } from 'graphql'
import { schema } from 'src/infra/graphql/schema'

describe('graphql schema', () => {
  test.skip('it should be instropected succesfully', async () => {
    // TODO: rever se é o q imagino
    const result = await graphql(schema, introspectionQuery)
    if (result.errors) {
      console.error(result.errors)
    }
    expect(result.errors).toBe([])
  })

  describe('it should be relay-compliant', () => {
    test('when introspecting a `Node` type, it should be the expected interface', () => {
      const source = `
        {
          __type(name: "Node") {
            name
            kind
            fields {
              name
              type {
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      `
      const result = graphqlSync({ schema, source })
      expect(result).toEqual({
        __type: {
          name: 'Node',
          kind: 'INTERFACE',
          fields: [
            {
              name: 'id',
              type: {
                kind: 'NON_NULL',
                ofType: {
                  name: 'ID',
                  kind: 'SCALAR',
                },
              },
            },
          ],
        },
      })
    })

    test('when introspecting all the schema, some query type should be the expected `node` field', () => {
      const source = `
        {
          __schema {
            queryType {
              fields {
                name
                type {
                  name
                  kind
                }
                args {
                  name
                  type {
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        }
      `
      const result = graphqlSync({ schema, source })

      const allFields = (result as any)?.__schema?.queryType?.fields
      expect(allFields).toBeTruthy()

      expect(allFields).toContainEqual({
        name: 'node',
        type: {
          name: 'Node',
          kind: 'INTERFACE',
        },
        args: [
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                name: 'ID',
                kind: 'SCALAR',
              },
            },
          },
        ],
      })
    })
  })
})
