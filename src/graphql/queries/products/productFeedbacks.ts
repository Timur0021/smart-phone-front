import { gql } from "@apollo/client/core";

export const GET_PRODUCT_FEEDBACKS = gql`
  query GetProductFeedbacks($id: Int!, $page: Int, $limit: Int) {
    productFeedbacks(
      input: {
        id: $id
        page: $page
        limit: $limit
      }
    ) {
      data {
        content
        created_at
        name
        rating
        surname
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