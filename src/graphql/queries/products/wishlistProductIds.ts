import { gql } from "@apollo/client/core";

export const GET_WISHLIST_STATUS = gql`
  query WishlistProducts($ids: [Int!]!) {
    wishlistProducts(ids: $ids)
  }
`;