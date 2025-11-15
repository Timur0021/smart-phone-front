import { gql } from '@apollo/client/core'

export const CREATE_REQUEST = gql`
  mutation CreateRequest($phone: String!) {
    createRequest(input: { phone: $phone }) {
      message
      status
    }
  }
`