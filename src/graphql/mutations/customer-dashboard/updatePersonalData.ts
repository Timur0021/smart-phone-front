import { gql } from '@apollo/client/core';

export const UPDATE_PERSONAL_DATA = gql`
    mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {
        updatePersonalData(input: $input) {
            id
            name
            last_name
            email
            phone
            password
            image
            image_object {
                 id
                 file_name
                 mime_type
                 size
                 created_at
            }
            i_agree
            remember_me
            created_at
            branch {
                name
            }
        }
    }
`;