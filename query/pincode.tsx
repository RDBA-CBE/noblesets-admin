import { gql } from '@apollo/client';

export const CREATE_PINCODE = gql`
    mutation MyMutation($input: PincodeInput!) {
        pincodeCreate(input: $input) {
            pincode {
                id
                codes
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
   query MyQuery(
  $after: String
  $before: String
  $first: Int
  $last: Int
  $filter: PincodeFilterInput
) {
  pincodes(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
  ) {
    edges {
      node {
        name
        codes
        id
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

export const UPDATE_PINCODE = gql`
    mutation MyMutation($id: ID!, $input: PincodeInput!) {
        pincodeUpdate(id: $id, input: $input) {
            pincode {
                id
                codes
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

export const CREATE_TAX = gql`
    mutation CreateTaxClass($input: TaxClassCreateInput!) {
        taxClassCreate(input: $input) {
            errors {
                message
                field
                code
            }
        }
    }
`;

export const UPDATE_TAX = gql`
    mutation UpdateTaxClass($id: ID!, $input: TaxClassUpdateInput!) {
        taxClassUpdate(id: $id, input: $input) {
            errors {
                message
                code
                field
            }
        }
    }
`;

export const TAX_LIST = gql`
    query GetTaxClasses($after: String, $before: String, $first: Int, $last: Int) {
        taxClasses(after: $after, before: $before, first: $first, last: $last) {
            edges {
                node {
                    id
                    name
                    countries {
                        rate
                        country {
                            code
                            country
                        }
                    }
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

export const DELETE_TAX = gql`
    mutation DeleteTaxClass($id: ID!) {
        taxClassDelete(id: $id) {
            errors {
                message
                code
            }
        }
    }
`;
