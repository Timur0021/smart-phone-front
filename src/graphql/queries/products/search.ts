import { gql } from "@apollo/client/core";

export const SEARCH = gql`
  query Search($search: String, $limit: Int) {
    search(
      input: {
        search: $search
        limit: $limit
      }
    ) {
      id
      code
      image
      name
      old_price
      price
      slug
    }
  }
`;