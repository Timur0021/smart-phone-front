import { gql } from "@apollo/client/core";

export const GET_PAGE = gql`
  query GetPage($slug: String!) {
    page(input: { slug: $slug }) {
      id
      title
      slug
      description
      meta_title
      meta_description
      blocks {
        id
        name
        type
        block {
          type
          data {
            key
            type
            value
            items {
              type
              data {
                key
                type
                value
                items {
                  type
                  data {
                    key
                    type
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
