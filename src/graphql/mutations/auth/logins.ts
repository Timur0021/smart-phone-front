import { gql } from '@apollo/client/core';

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                id
                name
                last_name
                phone
                email
                password
                remember_me
                i_agree
                created_at
                branch {
                    name
                }
            }
        }
    }
`