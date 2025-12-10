import { gql } from "@apollo/client/core";


export const GET_BRANDS = gql`
    query Brands($search: String) {
        brands(search: $search) {
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