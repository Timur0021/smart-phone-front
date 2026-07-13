import { gql } from '@apollo/client/core';

export const DELETE_WISHLIST = gql`
  mutation DeleteWishList($id: Int!) {
    deleteWishList(input: { id: $id }) {
      message
      status
    }
  }
`;