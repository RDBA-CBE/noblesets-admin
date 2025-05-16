import { gql } from '@apollo/client';

export const CREATE_BRAND = gql`
    mutation CreateBrand($input: BrandInput!) {
        brandCreate(input: $input) {
            brand {
                id
                name
                slug
                logo
            }
            errors {
                field
                message
            }
        }
    }
`;

export const BRAND_LIST = gql`
    query MyQuery($first: Int, $last: Int, $after: String, $before: String, $filter: BrandFilterInput) {
        brands(first: $first, last: $last, after: $after, before: $before, filter: $filter) {
            edges {
                node {
                    id
                    name
                    slug
                    logo
                }
            }
            totalCount
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`;

export const UPDATE_BRAND = gql`
    mutation UpdateBrand($id: ID!, $input: BrandInput!) {
        brandUpdate(id: $id, input: $input) {
            brand {
                id
                name
                slug
                logo
            }
            errors {
                field
                message
            }
        }
    }
`;

export const DELETE_BRAND = gql`
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

export const WAREHOUSE_LIST = gql`
    query MyQuery {
        warehouses(first: 10) {
            totalCount
            edges {
                cursor
                node {
                    id
                    name
                    slug
                    email
                }
            }
        }
    }
`;
