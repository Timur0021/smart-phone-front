import { gql } from '@apollo/client/core';

export const REGISTER = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
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