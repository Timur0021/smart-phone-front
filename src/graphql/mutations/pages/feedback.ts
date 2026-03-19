import { gql } from '@apollo/client/core';

export const CREATE_FEEDBACK = gql`
  mutation MyMutation(
    $first_name: String
    $phone: String
    $email: String
    $mark: Float
    $message: String
  ) {
    createFeedback(
      input: {
        first_name: $first_name
        phone: $phone
        email: $email
        mark: $mark
        message: $message
      }
    ) {
      message
      status
    }
  }
`;