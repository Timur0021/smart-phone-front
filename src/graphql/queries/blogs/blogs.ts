import { gql } from "@apollo/client/core";

export const GET_BLOGS = gql`
  query MyQuery($page: Int!, $limit: Int!, $category_slug: String) {
    blogs(input: { page: $page, limit: $limit, category_slug: $category_slug }) {
      data {
        name
        slug
        image
        description
        short_description
        published_at
        active
        meta_title
        meta_description
        category {
          name
          slug
          color
          active
        }
      }
      filters {
        id
        name
        slug
      }
      pagination {
        currentPage
        firstItem
        lastItem
        lastPage
        total
      }
    }
  }
`;