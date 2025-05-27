import { gql } from '@apollo/client';

export const STAFF_LIST = gql`
    query GetStaffUsers($first: Int, $last: Int, $after: String, $before: String, $search: String) {
        staffUsers(first: $first, last: $last, after: $after, before: $before, filter: { search: $search }) {
            edges {
                node {
                    email
                    isActive
                    isConfirmed
                    id
                    firstName
                    lastName
                    avatar {
                        url
                        __typename
                    }
                    __typename
                    isSuperUser
                }
                __typename
            }
            totalCount
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                __typename
            }
            __typename
        }
    }
`;

export const DELETE_STAFF = gql`
    mutation DeleteStaff($id: ID!) {
        staffDelete(id: $id) {
            errors {
                message
                code
            }
        }
    }
`;

export const CREATE_STAFF = gql`
    mutation CreateStaffUser($input: StaffCreateInput!) {
        staffCreate(input: $input) {
            errors {
                field
                message
            }
            user {
                id
                email
            }
        }
    }
`;

export const UPDATE_STAFF = gql`
    mutation UpdateStaffUser($id: ID!, $input: StaffUpdateInput!) {
        staffUpdate(id: $id, input: $input) {
            errors {
                message
                code
            }
        }
    }
`;
