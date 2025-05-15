import { gql } from '@apollo/client';

export const CREATE_PINCODE = gql`
    mutation MyMutation($input: PincodeInput!) {
        pincodeCreate(input: $input) {
            pincode {
                id
                code
                name
                slug
            }
            errors {
                code
                message
            }
        }
    }
`;

export const PINCODE_LIST = gql`
    query MyQuery($after: String, $before: String, $first: Int, $last: Int, $filter: PincodeFilterInput) {
        pincodes(after: $after, before: $before, first: $first, last: $last, filter: $filter) {
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
            totalCount
            edges {
                node {
                    code
                    name
                    slug
                    id
                }
            }
        }
    }
`;

export const UPDATE_PINCODE = gql`
    mutation MyMutation($id: ID!, $input: PincodeInput!) {
        pincodeUpdate(id: $id, input: $input) {
            pincode {
                id
                code
                name
                slug
            }
            errors {
                code
                message
            }
        }
    }
`;

export const DELETE_PINCODE = gql`
    mutation DeleteBrand($id: ID!) {
        brandDelete(id: $id) {
            brand {
                id
                name
                slug
            }
            errors {
                field
                message
            }
        }
    }
`;
