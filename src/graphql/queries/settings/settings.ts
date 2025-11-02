import { gql } from '@apollo/client/core';

export const GET_SETTINGS = gql`
    query MyQuery {
        settings {
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
              children {
                id
                name
                slug
              }
          }
        }
    }
`