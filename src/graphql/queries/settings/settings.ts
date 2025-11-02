import { gql } from '@apollo/client/core';

export const GET_SETTINGS = gql`
    query MyQuery {
        settings {
          settings {
            name
            key
            value
            to_front
            is_new_window
          }
          sidebars {
            name
            slug
            pages {
                id
                title
                slug
            }
          } 
          text_in_site {
            file
            is_new_window
            key
            link
            text
          }
          product_categories {
              id
              name
              slug
              will_be_soon
              children {
                id
                name
                slug
                will_be_soon
              }
          }
        }
    }
`