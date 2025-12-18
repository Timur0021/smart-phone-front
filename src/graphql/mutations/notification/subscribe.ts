import { gql } from '@apollo/client/core';

export const CREATE_SUBSCRIBE = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      message
      status
    }
  }
`