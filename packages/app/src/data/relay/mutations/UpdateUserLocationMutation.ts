import { environment } from '~/data/relay/environment'
import { commitMutation, graphql } from 'relay-runtime'
import type {
  LocationInput,
  UpdateUserLocationErrCodeType,
  UpdateUserLocationInput,
  UpdateUserLocationMutation as UpdateUserLocationMutationType,
} from '~/__generated__/UpdateUserLocationMutation.graphql'

const mutation = graphql`
  mutation UpdateUserLocationMutation($input: UpdateUserLocationInput!) {
    updateUserLocation(input: $input) {
      result {
        __typename
        ... on UpdateUserLocationOkResult {
          user {
            id
            userId
            location {
              latitude
              longitude
            }
            username
            phoneNumber
          }
        }
        ... on UpdateUserLocationErrResult {
          reason
          code
        }
      }
    }
  }
`

export const commitUpdateUserLocationMutation = (newLocation: LocationInput) => {
  return new Promise<void>((res, rej) => {
    commitMutation<UpdateUserLocationMutationType>(environment, {
      mutation,
      variables: { input: { location: newLocation } },
      onCompleted: (response, errors) => {
        if (errors !== null) rej(new Error(`Unexpected error: ${JSON.stringify(errors)}`))

        const result = response.updateUserLocation.result

        switch (result.__typename) {
          case 'UpdateUserLocationOkResult':
            res()
            break
          case 'UpdateUserLocationErrResult':
            rej(new Error(`Error updating the user location on server: ${JSON.stringify(result)}`))
            break
          default:
            rej(new Error(`Unexpected result typename: ${result.__typename}`))
        }
      },
      onError: rej,
    })
  })
}
