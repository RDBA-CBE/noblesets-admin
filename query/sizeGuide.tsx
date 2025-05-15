import { gql } from '@apollo/client';

export const CREATE_SIZEGUIDE = gql`
    mutation SizeGuidCreate($input: SizeGuidInput!) {
        sizeGuidCreate(input: $input) {
            errors {
                message
                code
                field
            }
        }
    }
`;

export const SIZEGUIDE_DETAIL = gql`
    query SizeGuidQuery($id: ID!) {
        sizeGuid(id: $id) {
            id
            sizedetail
            sizeimg
            name
            slug
        }
    }
`;

export const SIZEGUIDE_LIST = gql`
    query MyQuery($after: String, $before: String, $first: Int, $last: Int) {
        sizeGuids(after: $after, before: $before, first: $first, last: $last) {
            edges {
                node {
                    id
                    sizedetail
                    sizeimg
                    name
                    slug
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

export const UPDATE_SIZEGUIDE = gql`
    mutation SizeGuidUpdate($id: ID!, $input: SizeGuidInput!) {
        sizeGuidUpdate(id: $id, input: $input) {
            errors {
                field
                values
                message
            }
        }
    }
`;

export const DELETE_SIZEGUIDE = gql`
    mutation SizeGuidDelete($id: ID!) {
        sizeGuidDelete(id: $id) {
            errors {
                message
                values
                field
            }
        }
    }
`;
