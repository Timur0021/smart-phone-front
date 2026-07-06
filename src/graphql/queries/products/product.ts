import { gql } from "@apollo/client/core";

export const GET_PRODUCT = gql`
  query Product($slug: String!) {
    product(input: { slug: $slug }) {
      id
      name
      slug
      quantity
      price
      old_price
      discount
      views_count
      active
      meta_title
      meta_description
      brand {
        id
        name
        slug
        link
        image
        active
      }
      categories {
        id
        name
        slug
        image
        active
        will_be_soon
        parent {
          id
          name
          slug
        }
        children {
          id
          name
          slug
          image
          active
          will_be_soon
        }
      }
      values {
        id
        name
        slug
        sort_order
        active
        characteristic {
          id
          name
          slug
          sort_order
          active
          show_in_filter
          show_in_product
        }
      }
    }
  }
`;