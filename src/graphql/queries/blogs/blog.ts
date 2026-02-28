import { gql } from "@apollo/client/core";

export const BLOG = gql`
  query GetBlog($slug: String!) {
    blog(input: { slug: $slug }) {
      name
      slug
      short_description
      description
      image
      published_at
      meta_title
      meta_description
      active
      category {
        name
        slug
        color
        active
      }
    }
  }
`;