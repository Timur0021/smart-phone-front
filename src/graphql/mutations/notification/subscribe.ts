import { gql } from '@apollo/client/core';

export const SUBSCRIBE = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      message
      status
    }
  }
`