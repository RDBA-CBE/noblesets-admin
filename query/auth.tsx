import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        tokenCreate(email: $email, password: $password) {
            token
            refreshToken
            errors {
                field
                message
                __typename
            }
            user {
                email
                firstName
                id
                __typename
                isSuperUser
            }
            __typename
        }
    }
`;

export const CHECKOUT_TOKEN = gql`
    mutation CheckoutCreate($channel: String, $email: String) {
        checkoutCreate(input: { channel: $channel, email: $email, lines: [] }) {
            checkout {
                token
            }
            errors {
                field
                code
            }
        }
    }
`;
