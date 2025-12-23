import { gql } from '@apollo/client/core';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      last_name
      email
      phone
      image
      branch {
        name
      }
    }
  }
`;
