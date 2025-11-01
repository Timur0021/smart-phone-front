import { gql } from '@apollo/client/core';

export const GET_SETTINGS = gql`
  query MyQuery {
    settings {
      text_in_site {
        file
        is_new_window
        key
        link
        text
      }
    }
  }
`