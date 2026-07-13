import { gql } from '@apollo/client/core';

export const ADD_WISHLIST = gql`
  mutation AddWishList($id: Int!) {
    addWishList(input: { id: $id }) {
      message
      status
    }
  }
`;