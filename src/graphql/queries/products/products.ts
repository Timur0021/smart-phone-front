import { gql } from "@apollo/client/core";

export const GET_PRODUCTS = gql`
  query MyQuery(
    $page: Int!
    $limit: Int!
    $category_slug: String
    $filters: [Filter]
    $sort_by: SortByEnum
  ) {
    products(
      input: {
        page: $page
        limit: $limit
        category_slug: $category_slug
        filters: $filters
        sort_by: $sort_by
      }
    ) {
      data {
        active
        discount
        id
        meta_description
        meta_title
        name
        old_price
        price
        quantity
        slug
        views_count
        image
        is_favorite
      }

      filters {
        brands {
          active
          id
          image
          link
          name
          slug
        }

        categories {
          active
          id
          image
          name
          slug
          will_be_soon

          children {
            active
            id
            image
            name
            slug
            will_be_soon
          }
        }

        characteristics {
          id
          name

          values {
            id
            name
            slug
          }
        }
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