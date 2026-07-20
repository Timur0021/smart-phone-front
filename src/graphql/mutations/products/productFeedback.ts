import { gql } from '@apollo/client/core';

export const CREATE_PRODUCT_FEEDBACK = gql`
  mutation CreateProductFeedback(
    $content: String!
    $name: String!
    $surname: String!
    $product_id: Int!
    $rating: Float!
  ) {
    createProductFeedback(
      input: {
        content: $content
        name: $name
        surname: $surname
        product_id: $product_id
        rating: $rating
      }
    ) {
      message
      status
    }
  }
`;