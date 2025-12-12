import { gql } from "@apollo/client/core";

export const GET_BRANDS = gql`
    query Brands {
        brands {
            letters
            data {
                letter
                brands {
                    id
                    name
                    slug
                    link
                    image
                    active
                }
            }
        }
    }
`;
