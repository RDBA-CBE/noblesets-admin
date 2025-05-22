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

export const REPORT_LIST = gql`
    query GetCustomProducts($baseProduct: String, $after: String, $before: String, $first: Int, $last: Int) {
        customProducts(filter: { search: $baseProduct }, after: $after, before: $before, first: $first, last: $last) {
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
            totalCount
            edges {
                node {
                    customerName
                    email
                    customer {
                        firstName
                        lastName
                    }
                    customizationDetails
                    phone
                    createdAt
                    baseProduct {
                        slug
                        name
                        thumbnail {
                            url
                            alt
                        }
                    }
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
    mutation DeletePincode($id: ID!) {
        pincodeDelete(id: $id) {
            errors {
                message
                values
                code
            }
        }
    }
`;
